const express = require('express');
const cors = require('cors');
const path = require('path');

/**
 * -------------- GENERAL SETUP ----------------
 */

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config();

// Create the Express application
var app = express();

// Configures the database and opens a global connection that can be used in any module with `mongoose.connection`
require('./config/database');

// Must first load the models
require('./models/users');
require('./models/permissions');
require('./models/tokens');

// Instead of using body-parser middleware, use the new Express implementation of the same thing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allows our React application to make HTTP requests to Express application
app.use(cors());

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(require('./routes'));


// Where frontend builds to 
// When you run `ng build`, the output will go to the ./build directory
app.use(express.static(path.resolve(__dirname, '../mesoboard-app/build')));


app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../mesoboard-app/build', 'index.html'));
});

/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:3001
app.listen(3001);
