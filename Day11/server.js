import express from "express"

const app = express();
const PORT = 3000;


// Middleware to parse incoming JSON request bodies
app.use(express.json());

// Parese URL-encoded form submissions
app.use(express.urlencoded({extended: true}));

// Sample products -> stores in server memory
const products = [
    { id: 1, name: "Keyboard", category: "electronics", price: 1500 },
    { id: 2, name: "Mouse", category: "electronics", price: 800 },
    { id: 3, name: "Notebook", category: "stationery", price: 100 },
    { id: 4, name: "Monitor", category: "electronics", price: 12000 },
    { id: 5, name: "Pen", category: "stationery", price: 50 },
];

// Home route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Day 10 Product Filter API is running",
    });
});

// GET all Products
app.get("/api/products", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        products,
    });
});

app.get("/api/products/query", (req, res) => {
    const {
        category,
        maxPrice,
        sort = 'asc',
        keyword,
        limit = "10",
        offset = '0',
    } = req.query;

    // Validate numeric query parameters
    const priceLimit = Number(maxPrice);
    const pageSize = Number(limit);
    const startIndex = Number(offset);

    if (
        maxPrice !== undefined &&
        (maxPrice.trim() === "" ||
            !Number.isFinite(priceLimit) ||
            priceLimit < 0)
    ) {
        return res.status(400).json({
            message: "maxPrice must be a non-negative number",
        });
    }

    if (
        !/^\d+$/.test(limit) || !Number.isSafeInteger(pageSize) || pageSize < 1 || pageSize > 100
    ) {
        return res.status(400).json({
            message: "limit must be ab integer between 1 and 100",
        });
    }

    if (
        !/^\d+$/.test(offset) ||
        !Number.isSafeInteger(startIndex)
    ) {
        return res.status(400).json({
            message: "offset must be a non-negative integer",
        });
    }

    if (!['asc', 'desc'].includes(sort)) {
        return res.status(400).json({
            message: "sort must be asc or desc",
        });
    }

    // start with all products
    let result = [...products];

    // filter by category
    if (category) {
        result = result.filter (
            (product) => product.category.toLowerCase() === String(category).toLowerCase()
        );
    }

    // Filter by maximum price
    if (maxPrice !== undefined) {
        result = result.filter(
            (product) => product.price <= priceLimit
        );
    }

    // search by product name 
    if (keyword) {
        result = result.filter((product) => product.name.toLowerCase().includes(
            String(keyword).toLowerCase()
        ))
    }

    // sort by price
    result.sort((a, b) => sort === 'asc' ? a.price - b.price : b.price - a.price);

    // calculate pagination
    const total = result.length;
    const paginatedProducts = result.slice(
        startIndex,
        startIndex + pageSize
    );

    // Return response

    res.status(200).json({
        success: true,
        total,
        limit: pageSize,
        offset: startIndex,
        products: paginatedProducts,
    });
});

// Get products by id

app.get('/api/products/:id', (req, res) => {
    const id = Number.parseInt(req.params.id, 10);

    // validation
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            message: "Product ID must be a positive integer",
        });
    }

    const product = products.find((item) => item.id === id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found",
        });
    }

    res.status(200).json({
        success: true,
        product,
    });
});


app.post("/api/products", (req, res) => {
    const { name, category, price } = req.body ?? {};

    // Validate incoming data
    if (
        typeof name !== "string" ||
        !name.trim() ||
        typeof category !== "string" ||
        !category.trim() ||
        typeof price !== "number" ||
        !Number.isFinite(price) ||
        price < 0
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Valid name, category, and non-negative numeric price are required",
        });
    }

    // Generate a new ID
    const newProduct = {
        id: Math.max(0, ...products.map((product) => product.id)) + 1,
        name: name.trim(),
        category: category.trim().toLowerCase(),
        price,
    };

    // Add product to the array
    products.push(newProduct);

    // Return the created product
    res.status(201).json({
        success: true,
        message: "Product created successfully",
        product: newProduct,
    });
});

// testing middlewares
app.post('/api/form-test', (req, res) => {
    const { name, category } = req.body ?? {};

    if (typeof name !== "string" || !name.trim() || typeof category !== "string" || !category.trim()) {
        return res.status(400).json({
            success: false,
            message: "Name and category are required",
        });
    }

    res.status(200).json({
        success: true,
        message: "Form data received successfully",
        receivedDta: {
            name: name.trim(),
            category: category.trim(),
        },
    });
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});