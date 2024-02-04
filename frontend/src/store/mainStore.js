import {defineStore} from 'pinia';
import {useLocalStorage} from "@vueuse/core";
import {apiGet, apiRoutes} from "@/api/apiCalls.js";
import {Dark} from "quasar";

export const useMainStore = defineStore({
    id: 'mainStore',
    state: () => ({
        version: useLocalStorage('version', '0.0.0'),
        trendingCoins: useLocalStorage('trendingCoins', []),
        topCoins: useLocalStorage('topCoins', []),
        ohlcSymbol: useLocalStorage('ohlcSymbol', 'btc'),
        ohlcData: useLocalStorage('ohlcData', []),
        headlines: useLocalStorage('headlines', []),
        errorMessage: useLocalStorage('errorMessage', ''),
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
    getters: {
        backgroundColor() {
            if (Dark.isActive){
                return 'bg-purple-7';
            }
            return 'bg-blue-2';
        }
    }
});