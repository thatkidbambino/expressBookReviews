const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post('/register', (req, res) => {
    const { username, password } = req.body;
  
    // Check if username or password is missing
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Check if the username already exists
    if (users[username]) {
      return res.status(400).json({ message: "Username already exists" });
    }
  
    // Add the new user to the users object
    users[username] = { password };
    return res.status(201).json({ message: "User registered successfully" });
});
  

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).json(books);
});
  

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
});
  
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase(); // Retrieve the author from the request parameters and convert to lowercase
    const booksByAuthor = [];
  
    // Iterate through all the books
    for (let isbn in books) {
      if (books[isbn].author.toLowerCase() === author) {
        booksByAuthor.push(books[isbn]); // Add the book to the result array if the author matches
      }
    }
  
    if (booksByAuthor.length > 0) {
      return res.status(200).json(booksByAuthor); // Return the books by the author if found
    } else {
      return res.status(404).json({ message: "No books found by this author" }); // Return an error if no books are found
    }
});
  

// Get book details based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase(); // Retrieve the title from the request parameters and convert to lowercase
    const booksByTitle = [];
  
    // Iterate through all the books
    for (let isbn in books) {
      if (books[isbn].title.toLowerCase() === title) {
        booksByTitle.push(books[isbn]); // Add the book to the result array if the title matches
      }
    }
  
    if (booksByTitle.length > 0) {
      return res.status(200).json(booksByTitle); // Return the books with the matching title if found
    } else {
      return res.status(404).json({ message: "No books found with this title" }); // Return an error if no books are found
    }
});
  

// Get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters
    const book = books[isbn]; // Find the book with the corresponding ISBN
    
    if (book && book.reviews) {
      return res.status(200).json(book.reviews); // Return the reviews if the book and its reviews are found
    } else {
      return res.status(404).json({ message: "Book reviews not found" }); // Return an error if no reviews are found
    }
});
  
const jwt = require('jsonwebtoken');

// Secret key for JWT (in a real application, store this securely and do not hard-code it)
const secretKey = '1234';

public_users.post('/customer/login', (req, res) => {
    const { username, password } = req.body;
  
    // Log incoming login attempt
    console.log(`Login attempt for username: ${username}`);
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    const user = users[username];
    if (user && user.password === password) {
      const token = jwt.sign({ username: username }, secretKey, { expiresIn: '1h' });
      console.log(`Login successful for username: ${username}`);
      return res.status(200).json({ message: "Login successful", token: token });
    } else {
      console.log(`Login failed for username: ${username}`);
      return res.status(401).json({ message: "Invalid username or password" });
    }
});
  
  


module.exports.general = public_users;
