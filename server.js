// The code above will create a simple web server that can serve static files, handle URL-encoded form data, and JSON data. 
// The api route will be used to handle API requests, and the html route will be used to serve static HTML files.
const express = require('express');
const html = require('./routes/html');
const api = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./public'));

app.use(api);
app.use(html);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});