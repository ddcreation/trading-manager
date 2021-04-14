import store from '../redux/store';

const { REACT_APP_API_URL } = process.env;

const ApiResources = {
  cryptos: `/cryptos`,
  healthcheck: `/healthcheck`,
};

class Api {
  public resources = ApiResources;
  async retrieve<T>(resource: string): Promise<T> {
    const accessToken = store.getState().user.accessToken;

    return fetch(`${REACT_APP_API_URL}${resource}`, {
      headers: new Headers({
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      }),
    })
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
