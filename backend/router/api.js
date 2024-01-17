const express = require('express');
const router = express.Router();

router.get('/hello', (req, res) => {
    res.json({
        message: 'Hello World From The Backend!'
    });
});


const delay = async (ms) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}


router.get('/wait', async (req, res) => {
    const start = Date.now();
    await delay(req.query.delay || 1000);
    const end = Date.now();
    res.json({
        message: 'Hello World From The Backend with delay!',
        delay: req.query.delay || 1000,
        start,
        end,
        duration: end - start
    });
 });

module.exports = router;
