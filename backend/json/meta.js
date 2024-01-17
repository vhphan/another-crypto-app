externalEndPoints = {
    coingecko: [
        {
            url: "https://api.coingecko.com/api/v3/search/trending",
            result: "coingecko/trending.json",
            description: "Trending coins"
        },
        {
            url: "https://api.coingecko.com/api/v3/coins/list",
            result: "coingecko/coins.json",
            description: "List of all coins"
        },
        {
            url: "https://api.coingecko.com/api/v3/coins/{{id}}/history?date={{date}}",
            result: "coingecko/history.json",
            description: "History of a coin at a specific date, id from coins.json, date in DD-MM-YYYY format",
            example: "https://api.coingecko.com/api/v3/coins/bitcoin/history?date=10-10-2020"
        },
        {
            url: "https://api.coingecko.com/api/v3/coins/{{id}}/market_chart?vs_currency=usd&days=100",
            result: "coingecko/market_chart.json",
            description: "Market chart of a coin, id from coins.json",
            example: "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=100"
        },
        {
            url: "https://api.binance.com/api/v3/klines?symbol={{symbol}}&interval={{interval}}&limit={{limit}}",
            result: "binance/klines.json",
            description: "Klines of a pair symbol",
            example: "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=1000"
        },
        {
            url: "https://api.binance.com/api/v3/ticker/24hr",
            result: "binance/ticker24hr.json",
            description: "24hr ticker",
            example: "https://api.binance.com/api/v3/ticker/24hr"
        }
    ]
}