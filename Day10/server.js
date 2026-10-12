import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware: parse incoming JSON request bodies
app.use(express.json());

// Static bookstore catalog
const books = [
    {
        id: 1, 
        title: 'title 1',
        author: 'author 1',
        price: 500,
        featured: true
    },
    {
        id: 2, 
        title: 'title 2',
        author: 'author 2',
        price: 650,
        featured: true
    },
    {
        id: 3, 
        title: 'title 3',
        author: 'author 3',
        price: 400,
        featured: false
    },
    
];

let nextId = 4;

// GET: All Books
app.get('/books', (req, res) => {
    res.status(200).json({
        count: books.length,
        books
    });
});

// Get: Featured books
app.get('/books/featured', (req, res) => {
    const featuredBooks = books.filter(book => book.featured);

    res.status(200).json({
        count: featuredBooks.length,
        books: featuredBooks
    });
});

// GET: System status
app.get("/api/system-status", (req, res) => {
    res.status(200).json({
        status: "ok",
        service: "Bookstore catalog API",
        uptime: process.uptime()
    });
});

// POST: Add a book
app.post("/books", (req, res) => {
    const {title, author, price, featured = false} = req.body ?? {};

    if (
        typeof title !== "string" || !title.trim() ||
        typeof author !== "string" || !author.trim() ||
        typeof price !== "number" ||
        !Number.isFinite(price) || price<0 ||
        typeof featured !== "boolean"

    ) {
        return res.status(400).json({
            error: "Invalid book data",
            message: "Provide a title, author, non-negative numeric price, and optional boolean featured field."
        });
    }

    const book = {
        id: nextId++,
        title: title.trim(),
        author: author.trim(),
        price,
        featured
    };

    books.push(book);

    return res.status(201).json({
        message: "Book created successfully",
        book
    });
});

// PUT: Replace a books editable fields
app.put('/books/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = books.findIndex(book => book.id === id);

    if (!Number.isInteger(id) || index === -1) {
        return res.status(404).json({
            error: "Book not found"
        });
    }

    const {title, author, price, featured} = req.body ?? {};

    if (
        typeof title !== "string" || !title.trim() ||
        typeof author !== "string" || !author.trim() ||
        typeof price !== "number" ||
        !Number.isFinite(price) || price < 0 ||
        typeof featured !== "boolean"
    ) {
        return res.status(400).json({
            error: "Invalid book data",
            message: "Provide title, author, non-negative numeric price, and boolean featured."
        });
    }

    books[index] = {
        id,
        title: title.trim(),
        author: author.trim(),
        price, 
        featured
    };

    return res.status(200).json({
        message: "Book updated successfully",
        book: books[index]
    });
});

// DELETE: Remove a book
app.delete('/books/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = books.findIndex(book => book.id === id);

    if (!Number.isInteger(id) ||index === -1) {
        return res.status(404).json({
            error: "Book not found"
        });
    }

    const deletedBook = books.splice(index, 1)[0];

    return res.status(200).json({
        message: "Book deleted successfully",
        book: deletedBook
    });
});


// Handle malformed JSON from express.json()
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            error: "Bad Request",
            message: "Invalid JSON request body"
        });
    }
    
    return next(err);
});


// 404: Unknown routes
app.use((req, res) => {
    res.status(404).json({
        error: "Not Found",
        message: `Cannot ${req.method} ${req.originalUrl}`
    });
});
app.listen(PORT, () => {
    console.log(`Seerver is running at http://localhost:${PORT}`);
});

