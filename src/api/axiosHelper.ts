import { AxiosInstance, AxiosResponse } from "axios";

export class AxiosHelper {
  private instance: AxiosInstance;

  constructor(instance: AxiosInstance) {
    this.instance = instance;
  }

  get<T>(url: string, config?: any): Promise<T> {
    return this.instance.get<T>(url, config).then((res: AxiosResponse<T>) => res.data);
  }

  post<T>(url: string, data?: any, config?: any): Promise<T> {
    return this.instance.post<T>(url, data, config).then((res: AxiosResponse<T>) => res.data);
  }

  put<T>(url: string, data?: any, config?: any): Promise<T> {
    return this.instance.put<T>(url, data, config).then((res: AxiosResponse<T>) => res.data);
  }

  delete<T>(url: string, config?: any): Promise<T> {
    return this.instance.delete<T>(url, config).then((res: AxiosResponse<T>) => res.data);
  }
}
