// write the minimal node/express app

const express = require('express');
const cors = require('cors');

const app = express();

const path = require('path');
const errorHandler = require("#src/middlewares/error");

const port = 3000;

app.use(cors());

// serve static files from the frontend/dist directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// serve the frontend/index.html file
app.get('/app', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// use the router in router/api.js
app.use('/api/v1', require('./router/api.js'));

app.use(errorHandler);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});