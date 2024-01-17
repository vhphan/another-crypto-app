// write the minimal node/express app

const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

// serve static files from the frontend/dist directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// serve the frontend/index.html file
app.get('/app', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// use the router in router/api.js
app.use('/api/v1', require('./router/api.js'));


app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});