const { REACT_APP_API_URL } = process.env;

const ApiResources = {
  cryptos: `/cryptos`,
  healthcheck: `/healthcheck`,
};

class Api {
  public resources = ApiResources;
  async retrieve<T>(resource: string): Promise<T> {
    return fetch(`${REACT_APP_API_URL}${resource}`)
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
