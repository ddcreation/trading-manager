import axios from 'axios';

const { REACT_APP_API_URL } = process.env;

export class ApiService {
  private _apiUrl = REACT_APP_API_URL;

  public post<T>(path: string, body: any): Promise<void | T> {
    return new Promise((resolve) => {
      axios
        .post<T>(`${this._apiUrl}${path}`, body)
        .then((response) => resolve(response.data))
        .catch(this.errorHandler);
    });
  }

  public errorHandler(error: any): void {
    // TODO send UI redux action to show toaster
    console.log(error);
  }
}
