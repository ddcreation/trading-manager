const Binance = require('node-binance-api');

const binance = new Binance().options({
  APIKEY: process.env.BINANCE_API_KEY,
  APISECRET: process.env.BINANCE_API_SECRET,
  test: process.env.BINANCE_API_TEST && process.env.BINANCE_API_TEST === 'true',
});

export default binance;
