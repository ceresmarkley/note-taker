const express = require('express');
// require routes for html and api js files
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