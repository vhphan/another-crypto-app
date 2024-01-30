const express = require('express');
const cors = require('cors');

const app = express();

const path = require('path');
const errorHandler = require("#src/middlewares/error");
const {logger} = require("#src/middlewares/logger");

const port = 3000;

require('dotenv').config();

app.use(cors());

// Middleware to log start time
app.use((req, res, next) => {
    req.requestTime = process.hrtime();
    next();
});

// use the router in router/api.js
app.use('/api/v1', require('./router/api.js'));

// serve static files from the frontend/dist directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// serve the frontend/index.html file
app.get('/app', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Middleware to log end time and calculate total time
app.use((req, res, next) => {
    const start = req.requestTime;
    const end = process.hrtime(start);

    // end[0] is in seconds, end[1] is in nanoseconds
    const totalTime = end[0] * 1000 + end[1] / 1e6; // convert to milliseconds

    logger.info(`Request to ${req.path} took ${totalTime} ms`);
    next();
});

app.use(errorHandler);

app.listen(port, () => {
    logger.info(`App listening on port ${port}`);
});