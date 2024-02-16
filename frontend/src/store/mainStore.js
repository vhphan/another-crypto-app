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

        headlines: useLocalStorage('headlines', []),
        errorMessage: useLocalStorage('errorMessage', ''),

        minChartHeight: useLocalStorage('minChartHeight', 350),
        darkMode: useLocalStorage('darkMode', false),

        ohlcSymbol: useLocalStorage('ohlcSymbol', 'btc'),
        ohlcData: [],

        trendingOhlcSymbol: useLocalStorage('trendingOhlcSymbol', ''),
        trendingOhlcData: {},

    }),
    actions: {
        async getOhlcData(symbol, vsCurrency, days) {
            const responseData = (await apiGet(apiRoutes.ohlc, {
                    params: {
                        symbol: symbol,
                        vsCurrency: vsCurrency,
                        days: days,
                    }
                })
            ).data;
            this.ohlcData = responseData?.data;
        },
        async getTrendingOhlcData() {
            const responseData = (await apiGet(apiRoutes.dataForSymbol, {
                    params: {
                        symbol: this.trendingOhlcSymbol,
                    }
                })
            ).data;
            this.trendingOhlcData = responseData?.data;
        },
    },
    getters: {
        backgroundColor() {
            if (Dark.isActive) {
                return 'bg-purple-7';
            }
            return 'bg-blue-2';
        },
        chartHeight() {
            return Math.max(window.innerHeight - 500, this.minChartHeight);
        }
    }
});