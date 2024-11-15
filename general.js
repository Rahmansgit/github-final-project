const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  // Check if the username is valid (i.e., it does not already exist)
  if (isValid(username)) {
    // Register the new user
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully!" });
  } else {
  return res.status(300).json({message: "Yet to be implemented"});


}
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  return res.status(200).json({ books: books });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here

  const { isbn } = req.params;
  const book = books.find(b => b.isbn === isbn);
  
  if (book) {
    return res.status(200).json({ book: book });
  } else {
    return res.status(300).json({message: "Yet to be implemented"});
  }
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here

  const { author } = req.params;
  const booksByAuthor = books.filter(b => b.author.toLowerCase().includes(author.toLowerCase()));
  
  if (booksByAuthor.length > 0) {
    return res.status(200).json({ books: booksByAuthor });
  } else {
    return res.status(300).json({message: "Yet to be implemented"});
  }
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const { isbn } = req.params;
  const book = books.find(b => b.isbn === isbn);
  
  if (book && book.reviews) {
    return res.status(200).json({ reviews: book.reviews });
  } else {
    return res.status(300).json({message: "Yet to be implemented"});
  }
  
});

module.exports.general = public_users;
