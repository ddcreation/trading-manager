const { REACT_APP_API_URL } = process.env;

export const ApiResources = {
  cryptos: `${REACT_APP_API_URL}/cryptos`,
  healthcheck: `${REACT_APP_API_URL}/healthcheck`,
};

class Api {
  resources = ApiResources;
}

export default new Api();
