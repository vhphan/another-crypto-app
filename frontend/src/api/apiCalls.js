import {apiAx} from "@/plugins/http.js";


export const apiRoutes = {
    // region level
    // dailyStatsRegion: '/v1/dailyStatsRegion',
    trending: '/trending',
    topCoins: '/topCoins',
};

export const apiGet = (urlRef, options = {}) => {
    return apiAx().get(urlRef, options);
};

