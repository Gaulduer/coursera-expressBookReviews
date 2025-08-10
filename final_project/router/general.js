const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const userExists = (username) => {

}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if(isValid(username))
            return res.status(404).send("User already exists!");

        // Add the new user to the users array
        users.push({"username": username, "password": password});
        return res.status(200).send("User successfully registered. Now you can login");
    }

    // Return error if username or password is missing
    return res.status(404).send("Unable to register user. Missing username or password");
});

public_users.get('/',function (req, res) {
  res.status(300);
  return res.send('Books:\n' + JSON.stringify(books, null, 4) + "\n");
});

public_users.get('/isbn/:isbn',function (req, res) {
  res.status(300);
  
  const book = books[req.params.isbn];
  
  if(!book)
    return res.send("Unable to find book with provided isbn.");
  
  return res.send("Details for book with isbn " + req.params.isbn + ":\n" + JSON.stringify(book, null, 4) + "\n");
 });
  
public_users.get('/author/:author',function (req, res) {
    res.status(300);
    
    const author = req.params.author;
    const books_by_author = {};

    for(let isbn in books) {
        if(books[isbn]["author"] === author)
          books_by_author[isbn] = books[isbn];
    }

    return res.send("Books by " + author + ":\n" + JSON.stringify(books_by_author, null, 4) + "\n");
});

public_users.get('/title/:title',function (req, res) {
  res.status(300);
    
  const title = req.params.title;
  const books_by_title = {};

  for(let isbn in books) {
    if(books[isbn]["title"] === title)
      books_by_title[isbn] = books[isbn];
  }

  return res.send("Books titled " + title + ":\n" + JSON.stringify(books_by_title, null, 4) + "\n");
});

public_users.get('/review/:isbn',function (req, res) {
  res.status(300);
  
  const book = books[req.params.isbn];

  if(!book)
    return res.send("Unable to find book with provided isbn");

  return res.send(JSON.stringify(book["reviews"], null , 4) + '\n');
});

module.exports.general = public_users;
