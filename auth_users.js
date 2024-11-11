const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some(user => user.username === username);

}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

const user = users.find(user => user.username === username);
  return user && user.password === password;

}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
const { username, password } = req.body;
 // Check if the user exists and the password is correct
  if (authenticatedUser(username, password)) {
    // Create a JWT token
    const payload = { username: username };
    const secretKey = 'your_jwt_secret_key'; // Replace with your secret key
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Token expires in 1 hour

    // Send the token in the response
    return res.status(200).json({
      message: "Login successful",
      token: token
    });
  } else {
    // If authentication fails, return an error message
  return res.status(300).json({message: "Yet to be implemented"});
 }


});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { isbn } = req.params;
  const { review } = req.body; // Assuming the review text is sent in the body of the request
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: "Authorization token required" });
  }

  // Remove the 'Bearer ' prefix if present
  const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7) : token;

  // Verify the JWT token
  jwt.verify(tokenWithoutBearer, 'your_jwt_secret_key', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    // The user is authenticated, now we can add or modify the review
    const username = decoded.username; // Get the username from the decoded token

    // Find the book by ISBN and update or add the review
    const book = books.find(b => b.isbn === isbn);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if the book already has a review for this user, and update it if necessary
    const existingReview = book.reviews.find(r => r.username === username);

    if (existingReview) {
      // Modify the existing review
      existingReview.review = review;
    } else {
      // Add a new review
      book.reviews.push({ username: username, review: review });
    }

    return res.status(200).json({ message: "Review added/modified successfully", book: book });
  });
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
