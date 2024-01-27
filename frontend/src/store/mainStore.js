import {defineStore} from 'pinia';
import {useLocalStorage} from "@vueuse/core";
import {apiGet, apiRoutes} from "@/api/apiCalls.js";


export const useMainStore = defineStore({
    id: 'mainStore',
    state: () => ({
        version: useLocalStorage('version', '0.0.0'),
        trendingCoins: useLocalStorage('trendingCoins', []),
        topCoins: useLocalStorage('topCoins', []),
        ohlcSymbol: useLocalStorage('ohlcSymbol', 'BTC'),
        ohlcData: useLocalStorage('ohlcData', []),
    }),
    actions: {
        async getOhlcData(symbol = 'BTC', vsCurrency = 'USD', days = 90) {
            const responseData = (await apiGet(apiRoutes.ohlc, {
                    params: {
                        symbol,
                        vsCurrency,
                        days,
                    }
                })
            ).data;
            this.ohlcData = responseData?.data;
        }
    },
    getters: {}
});