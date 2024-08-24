const express = require('express');
const axios = require('axios'); // Import Axios
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (users.some(user => user.username === username)) {
        return res.status(400).json({ message: "Username already exists" });
    }

    users.push({ username, password });
    console.log('Registered users:', users);
    return res.status(201).json({ message: "User registered successfully" });
});

public_users.get('/', function (req, res) {
    return res.status(200).json(books);
});

public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

public_users.get('/async-isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const response = await axios.get(`http://localhost:5001/isbn/${isbn}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch book details", error });
    }
});

public_users.get('/promise-isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    axios.get(`http://localhost:5001/isbn/${isbn}`)
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(error => {
            res.status(500).json({ message: "Failed to fetch book details", error });
        });
});

public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase();
    const booksByAuthor = [];

    for (let isbn in books) {
        if (books[isbn].author.toLowerCase() === author) {
            booksByAuthor.push(books[isbn]);
        }
    }

    if (booksByAuthor.length > 0) {
        return res.status(200).json(booksByAuthor);
    } else {
        return res.status(404).json({ message: "No books found by this author" });
    }
});

public_users.get('/async-author/:author', async function (req, res) {
    try {
        const author = req.params.author.toLowerCase();
        const response = await axios.get(`http://localhost:5001/author/${author}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch books by author", error });
    }
});

public_users.get('/promise-author/:author', function (req, res) {
    const author = req.params.author.toLowerCase();
    axios.get(`http://localhost:5001/author/${author}`)
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(error => {
            res.status(500).json({ message: "Failed to fetch books by author", error });
        });
});

public_users.get('/async-title/:title', async function (req, res) {
    try {
        const title = req.params.title.toLowerCase();
        const response = await axios.get(`http://localhost:5001/title/${title}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch books by title", error });
    }
});

public_users.get('/promise-title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
    axios.get(`http://localhost:5001/title/${title}`)
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(error => {
            res.status(500).json({ message: "Failed to fetch books by title", error });
        });
});

public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
    const booksByTitle = [];
  
    for (let isbn in books) {
        if (books[isbn].title.toLowerCase() === title) {
            booksByTitle.push(books[isbn]);
        }
    }
  
    if (booksByTitle.length > 0) {
        return res.status(200).json(booksByTitle);
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});

public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    
    if (book && book.reviews) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "Book reviews not found" });
    }
});

public_users.get('/books', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5001/');
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch books", error });
    }
});

module.exports.general = public_users;
