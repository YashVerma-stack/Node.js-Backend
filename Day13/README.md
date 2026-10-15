# Application-Lrvrl vs Route-Level Middleware 
1. Application-level middleware
    - Appliction level middleware is registered using app.use() or an application method such as app.get()

    - **Example**:
    ```
    app.use((req, res, next) => {
        console.log("Application-level middleware");
        next();
    });
    ```
2. Router-level middleware
    - Route-level middleware is attached to a specific route, so you can apply logic only where it is needed.

    - **Example**
    ```
        function checkAccess(req, res, next) {
            console.log("Route-level middleware");
            next();
        }

        app.get("/api/tasks", checkAccess, (req, res) => {
            res.json({ message: "Tasks fetched successfully" });
        });
    ```

### Topic to understand
-  `req.headers["x-api-key"]` reads the key supplied by the client.
- `process.env.API_KEY` retrieves the configured key.
- If the key is missing or incorrect, the middleware returns a `401 Unathorized` response.
- If the key matches, `next()` allows the request to continue.

### What is error-handling middleware ?
- In express, error-handling middleware used four parameters:

```
(err, req, res, next)
```

- `err` - the error object
- `req` - the incoming request
- `res` - the outgoing response
- `next` - passes the error to another error handler if needed.

Unlike normal middleware, Express recognizes error-handling middleware by its four-parameter signature

### CORS
- CORS stands for Cross-Origin Resourse Sharing.
- Browsers use the same-origin policy to restrict frontend JavaScript from accessing resources on a differentorigin unless the server permits it though the appropriate CORS