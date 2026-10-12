
import http from "node:http";

const users = [];
let nextId = 1;

const MAX_BODY_SIZE = 1024 * 1024; // 1 MB

function sendJSON(res, statusCode, data, headers = {}) {
    if (res.writableEnded || res.destroyed) {
        return;
    }

    res.writeHead(statusCode, {
        "Content-Type": "application/json; charset=utf-8",
        ...headers
    });

    res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
    const { method } = req;

    const url = new URL(
        req.url,
        `http://${req.headers.host || "localhost"}`
    );

    const pathname = url.pathname;

    console.log(`${method} ${pathname}`);

    // GET: Health check
    if (method === "GET" && pathname === "/api/health") {
        return sendJSON(res, 200, {
            status: "ok",
            message: "Server is running"
        });
    }

    // GET: All users
    if (method === "GET" && pathname === "/api/users") {
        return sendJSON(res, 200, {
            count: users.length,
            users
        });
    }

    // POST: Create a user
    if (method === "POST" && pathname === "/api/users") {
        const chunks = [];
        let bodySize = 0;
        let tooLarge = false;

        req.on("data", (chunk) => {
            if (tooLarge) return;

            bodySize += chunk.length;

            if (bodySize > MAX_BODY_SIZE) {
                tooLarge = true;
                chunks.length = 0;

                sendJSON(res, 413, {
                    error: "Payload Too Large",
                    message: "Request body must not exceed 1 MB"
                });

                return;
            }

            chunks.push(chunk);
        });

        req.on("end", () => {
            if (tooLarge || res.writableEnded || res.destroyed) {
                return;
            }

            let userData;

            try {
                const rawBody = Buffer.concat(chunks).toString("utf-8");
                userData = JSON.parse(rawBody);
            } catch {
                return sendJSON(res, 400, {
                    error: "Bad Request",
                    message: "Invalid JSON request body"
                });
            }

            // Validate the request body
            if (
                !userData ||
                typeof userData !== "object" ||
                Array.isArray(userData) ||
                typeof userData.name !== "string" ||
                !userData.name.trim() ||
                typeof userData.role !== "string" ||
                !userData.role.trim()
            ) {
                return sendJSON(res, 400, {
                    error: "Bad Request",
                    message: "name and role must be non-empty strings"
                });
            }

            const user = {
                id: nextId++,
                name: userData.name.trim(),
                role: userData.role.trim()
            };

            users.push(user);

            return sendJSON(res, 201, {
                message: "User created successfully",
                user
            });
        });

        req.on("error", (error) => {
            console.error("Request stream error:", error.message);

            if (!res.writableEnded && !res.destroyed) {
                sendJSON(res, 400, {
                    error: "Bad Request",
                    message: "Unable to read request body"
                });
            }
        });

        return;
    }

    // Known routes, but unsupported HTTP methods
    const knownPaths = ["/api/health", "/api/users"];

    if (knownPaths.includes(pathname)) {
        const allowedMethods =
            pathname === "/api/health" ? "GET" : "GET, POST";

        return sendJSON(
            res,
            405,
            {
                error: "Method Not Allowed",
                message: `${method} is not supported for ${pathname}`
            },
            {
                Allow: allowedMethods
            }
        );
    }

    // Unknown route
    return sendJSON(res, 404, {
        error: "Not Found",
        message: `Route ${method} ${pathname} does not exist`
    });
});

server.listen(4000, () => {
    console.log("Server running at http://localhost:4000");
});
