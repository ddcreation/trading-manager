const { REACT_APP_API_URL } = process.env;

export const ApiResources = {
  cryptos: `${REACT_APP_API_URL}/cryptos`,
  healthcheck: `${REACT_APP_API_URL}/healthcheck`,
};

class Api {
  resources = ApiResources;

  async retrieve<T>(url: string): Promise<T> {
    return fetch(url)
      .then(this.errorHandler)
      .then((res) => res.text())
      .then((res) => JSON.parse(res))
      .catch((error) => {
        // TODO: toaster error
        console.error(error);
      });
  }

  errorHandler(response: Response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }
}

export default new Api();
