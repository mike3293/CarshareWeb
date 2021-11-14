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
      `${this.baseUrl}/${path}${params ? `?${this.buildParams(params)}` : ""}`,
      {
        method: "GET",
        ...init,
      }
    );

    return await response.json();
  }

  private buildParams(search: URLSearchParamsInit) {
    const params = new URLSearchParams();

    Object.entries(search).forEach(([key, value]) => {
      if (!value) {
        return;
      }

      Array.isArray(value)
        ? value.forEach((item) => item && params.append(key, item))
        : params.append(key, value);
    });

    return params;
  }
}

export default ServiceBase;
