
import http from "node:http";

const server = http.createServer((req, res) => {
    const { url, method } = req;

    console.log(`${method} ${url}`);

    // Helper to send JSON responses
    function sendJSON(statusCode, data) {
        res.writeHead(statusCode, {
            "Content-Type": "application/json; charset=utf-8"
        });

        res.end(JSON.stringify(data));
    }

    // Route 1: Health check
    if (url === "/api/health" && method === "GET") {
        return sendJSON(200, {
            status: "ok",
            message: "Server is running"
        });
    }

    // Route 2: Create a user
    if (url === "/api/users" && method === "POST") {
        const chunks = [];
        let bodySize = 0;
        const MAX_BODY_SIZE = 1024 * 1024; // 1 MB

        req.on("data", (chunk) => {
            bodySize += chunk.length;

            if (bodySize > MAX_BODY_SIZE) {
                sendJSON(413, {
                    error: "Payload Too Large"
                });

                req.destroy();
                return;
            }

            chunks.push(chunk);
        });

        req.on("end", () => {
            if (res.destroyed || res.writableEnded) {
                return;
            }

            try {
                const rawBody = Buffer.concat(chunks).toString("utf-8");

                const user = JSON.parse(rawBody);

                if (
                    !user ||
                    typeof user !== "object" ||
                    Array.isArray(user) ||
                    typeof user.name !== "string" ||
                    !user.name.trim() ||
                    typeof user.role !== "string" ||
                    !user.role.trim()
                ) {
                    return sendJSON(400, {
                        error: "name and role must be non-empty strings"
                    });
                }

                return sendJSON(201, {
                    message: "User created successfully",
                    user: {
                        name: user.name.trim(),
                        role: user.role.trim()
                    }
                });
            } catch {
                return sendJSON(400, {
                    error: "Invalid JSON request body"
                });
            }
        });

        req.on("error", (error) => {
            console.error("Request stream error:", error.message);
        });

        return;
    }

    // Route 3: Unknown route
    return sendJSON(404, {
        error: "Not Found",
        message: `Route ${method} ${url} does not exist`
    });
});

server.listen(4000, () => {
    console.log("Server running at http://localhost:4000");
});
