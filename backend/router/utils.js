import {logger} from "../middlewares/logger";


const externalApi = async (req, res, next) => {
    const path = req.originalUrl.split('/externalApi/')[1];
    let headers = {};
    if (path.includes('coingecko.com')){
        headers['X-CMC_PRO_API_KEY'] = process.env.COINMARKET_CAP_API_KEY;
    }
    const finalUrl = `https://${path}`;
    try {
        logger.info(`proxying ${finalUrl}`);
        const apiRes = await needle('get', finalUrl, {headers});
        const data = apiRes.body;
        res.status(200).send(data);
    } catch (error) {
        next(error);
    }
};