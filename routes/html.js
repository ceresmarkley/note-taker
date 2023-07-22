// create express and path objects using require, connecting to modules. Will allow router (for express) and join (for path)
const express = require('express');

const path = require('path');

const html = express.Router();
// notes.html route
html.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/notes.html'));
});
// index.html route 
html.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});
  
module.exports = html;