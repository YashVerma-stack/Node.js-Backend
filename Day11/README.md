# Types of Request Data
#### Before writing code, understnd how the client send information to your Express server.

1. Route Parameters - `req.params`
    - Used to identify a particular resource.

    ```
    GET /api/products/101
    ```
    ```

    syntax - app.get("/api/products/:id", (req, res) => {
        res.json ({id: req.params.id});
    });
    ```
    ```

    output - {
        "id": "101"
    }
    ```

    - The Calue is a string by default, even when it looks like a number.
    

2. Query Parameters - `req.query`
    - Used to filtering, searching, sorting, and pagination.

    ```
    GET /api/products?category=electronics&maxPrice=50000

    ```
    ```
    syntax - app.get("/api/products", (req, res) => {
        const {category, maxPrice} = req.query;

        res.json({category, maxPrice});
    })
    ```
    ```

    Output - {
        "category": "electronics",
        "maxPrice": "50000"
    }
    
    ```
    - Query values are also typically strings. Convert and validate them before using them in calculation

3. Request body - `req.body`

    - Used to send data when creating or updating a resource.

    ```
    POST /api/products
    ```
    JSON body: 
    ```
    {
        "name": "Keyboard",
        "price": 1500,
        "category": "electronics"
    }
    ```

    ```
    syntax
    app.use(express.json());

    app.post("/api/products", (req, res) => {
        res.status(201).json(req.body);
    });
    ```
    - **Important**: `express.json()` must be registered before he routes that need parsed JSON bodies.

##  Difference between `express.json()` and `express.urlencoded()`

#### Express client can send data in different formats.

`express.json()`
`JSON data`
- Used when the client sends JSON, typically from Postman, React, or another API.
    ```
    {
        "name": "Keyboard",
        "price": 1500
    }
    ```
    Middleware
    ```
    app.use(express.json());
    ```

`express.urlencoded()` -> `HTML form data`
- Used for form submissions encoded as `application/x-www-form-urlencoded`.

    ```
    name=Keyboard&price=1500
    ```
    Middleware
    ```
    app.use(express.urlencoded({ extended: true }));
    ```
    


