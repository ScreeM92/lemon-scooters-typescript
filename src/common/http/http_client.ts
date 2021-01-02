import axios, { AxiosPromise, AxiosRequestConfig } from "axios";

class HttpClient {
  async get(url: string | undefined): Promise<AxiosPromise<any>> {
    const config: AxiosRequestConfig = {
      url,
      method: "GET"
    };

    return axios(config);
  }

  async getFile(url: string | undefined): Promise<AxiosPromise<any>> {
    const config: AxiosRequestConfig = {
      url,
      method: "GET",
      responseType: "stream"
    };

    return axios(config);
  }
}

export default new HttpClient;