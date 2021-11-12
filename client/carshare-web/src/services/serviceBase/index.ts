import { URLSearchParamsInit } from "./types";

abstract class ServiceBase {
  baseUrl!: string;

  protected initialize(config: { baseURL: string }) {
    this.baseUrl = config.baseURL;
  }

  protected async get<TResult>(
    path: string,
    params?: URLSearchParamsInit,
    init?: RequestInit
  ): Promise<TResult> {
    const response = await fetch(
      this.baseUrl + "/" + path + new URLSearchParams(params),
      {
        method: "GET",
        ...init,
      }
    );

    return await response.json();
  }
}

export default ServiceBase;
