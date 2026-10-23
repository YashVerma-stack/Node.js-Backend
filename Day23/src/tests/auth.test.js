import "dotenv/config";
import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import jwt from "jsonwebtoken";
import request from "supertest";

import {authenticateToken} from '../middleware/authenticateToken.js'
import {authorizeRole} from '../middleware/authorizeRole.js'

const app = express();

app.get('/profile', authenticateToken, (req, res) => {
    res.status(200).json({user: req.user});
});

app.get(
    "/admin", authenticateToken, authorizeRole("admin"), (req, res) => {
        res.status(200).json({message: "Admin access granted"});
    }
);

const secret = process.env.JWT_ACCESS_SECRET;

if (!secret || secret.length < 32) {
    throw new Error("Configure JWT_ACCESS_SECRET in .env");
}

const makeToken = (payload, options = {}) => 
    jwt.sign(
        {id: "test-user", role: "user", type: "access", ...payload},
        secret,
        {algorithm: "HS256", expiresIn: "15m", ...options}
    );

test('reject a missing token with 401', async () => {
    const res = await request(app).get('/profile');
    assert.equal(res.status, 401);
});

test('reject a malformed Bearer header with 401', async () => {
    const res = await request(app)
    .get('/profile')
    .set("Authorization", 'Bearer');

    assert.equal(res.status, 401);
});

test("rejects a forged token with 401", async () => {
    const forged = jwt.sign(
        { id: "attacker", role: "admin", type: "access" },
        "a-different-secret-that-is-not-the-server-secret",
        { algorithm: "HS256", expiresIn: "15m" }
    );

    const res = await request(app)
        .get("/admin")
        .set("Authorization", `Bearer ${forged}`);

    assert.equal(res.status, 401);
});

test("rejects an expired token with 401", async () => {
    const expiredToken = makeToken({}, { expiresIn: -1 });

    const res = await request(app)
        .get("/profile")
        .set("Authorization", `Bearer ${expiredToken}`);

    assert.equal(res.status, 401);
    assert.equal(res.body.message, "Access token expired");
});

test("rejects a user token from the admin route with 403", async () => {
    const userToken = makeToken({ role: "user" });

    const res = await request(app)
        .get("/admin")
        .set("Authorization", `Bearer ${userToken}`);

    assert.equal(res.status, 403);
});

test("allows an admin token to access the admin route", async () => {
    const adminToken = makeToken({ id: "admin-1", role: "admin" });

    const res = await request(app)
        .get("/admin")
        .set("Authorization", `Bearer ${adminToken}`);

    assert.equal(res.status, 200);
});