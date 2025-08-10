const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
  for(let i = 0 ; i < users.length ; i++)
    if(users[i].username === username && users[i].password === password)
      return true;

  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).send("Error logging in. Missing username or password.\n");
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    // Store access token and username in session
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in.\n");
  } 
  else {
    return res.status(208).send("Invalid Login. Check username and password.\n");
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  const review = req.query.review;
  const book = books[isbn];

  if(!book)
    return res.status(404).send("Unable to find book with isbn" + isbn + ".\n");

  if(!review)
    return res.status(404).send("There was no review provided.\n");


  book["reviews"][username] = review;

  return res.status(300).send("Review for book with isbn " + isbn + " has been posted by " + username + ".\n");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  const book = books[isbn];

  if(!book)
    return res.status(404).send("Unable to find book with isbn" + isbn + ".\n");

  delete book["reviews"][username];

  return res.status(300).send("Review for book with isbn " + isbn + " has been deleted.\n");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
