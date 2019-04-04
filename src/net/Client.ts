import axios from 'axios';
import { AxiosRequestConfig, AxiosInstance, AxiosPromise, AxiosResponse} from 'axios';

export default class Client {

  accessKey: string
  axi: AxiosInstance

  constructor(base: string, accessKey: string) {
    this.accessKey = accessKey;
    this.axi = axios.create({
      baseURL: base,
      proxy: false
    });
  }

  login (): AxiosPromise<AxiosResponse> {

    const config: AxiosRequestConfig = {
      method: 'post',
      url: '/ccadmin/v1/login',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Authorization': `Bearer ${this.accessKey}`
      },
      data: 'grant_type=client_credentials' 
    };

    return this.axi.request(config);
  }
};