const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname, '../public');
const app = express();
const port = process.env.PORT || 3000; // must have process.env.PORT for heroku.

// app.use add a middleware
// express.static add a static page, it gets the absolute path
app.use(express.static(publicPath));

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});

