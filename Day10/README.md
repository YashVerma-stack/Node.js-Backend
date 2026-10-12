## Concepts
1. `app.use(express.json())`
    -  This is middleware that parses incoming JSON request bodies and makes the parsed data available as `req.body`. It is useful when you implement POST or PUT endpoints.
2. `res.status(200)`
    - Sets the HTTp response status code. It returns the response object, allowing you to chain `.json()`.
3. `res.json()`
    - Serializes the supplied JavaScript value as JSON and sends it with the appropriate JSON content type.
4. `process.uptime()`
    - Return the number of seconds the current Node.js process has been running.

5. `app.use()`
    - Register middleware. In this example, the final middleware act as a 404 handler because it runs only after the earlier routes have not handled the request.

6. `req.body`
    ```
    const { title, author, price } = req.body ?? {};
    ```

    - `express.json()` parse JSON request bodies and populates `req.body`.
    - The `?? {}` fallback ensures destructuring has an empty object is the body is missing

### Route parameters

```
app.put('/books/:id', (req, res) => {
    const id = Number(req.params.is);
});
```