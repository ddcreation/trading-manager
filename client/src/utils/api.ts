const { REACT_APP_API_URL } = process.env;

export const ApiResources = {
  cryptos: `${REACT_APP_API_URL}/cryptos`,
  healthcheck: `${REACT_APP_API_URL}/healthcheck`,
};

class Api {
  resources = ApiResources;

  async retrieve<T>(url: string): Promise<T> {
    return fetch(url)
      .then((res) => res.text())
      .then((res) => JSON.parse(res));
  }
}

export default new Api();
