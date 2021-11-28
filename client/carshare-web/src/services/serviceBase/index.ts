import { BodyInitOrObject, URLSearchParamsInit } from "./types";

abstract class ServiceBase {
  baseUrl!: string;
  protected willSendRequest?(request: RequestInit): void | Promise<void>;

  protected initialize(config: { baseURL: string }) {
    this.baseUrl = config.baseURL;
  }

  protected async get<TResult>(
    path: string,
    params?: URLSearchParamsInit,
    init?: RequestInit
  ): Promise<TResult> {
    const response = await this.fetch(path, "GET", params, undefined, init);

    return await response.json();
  }

  protected async post<TResult>(
    path: string,
    body?: BodyInitOrObject,
    params?: URLSearchParamsInit,
    init?: RequestInit
  ): Promise<TResult> {
    const response = await this.fetch(path, "POST", params, body, init);

    return await response.json();
  }

  private async fetch(
    path: string,
    method: string,
    params?: URLSearchParamsInit,
    body?: BodyInitOrObject,
    options: RequestInit = {}
  ) {
    if (this.willSendRequest) {
      await this.willSendRequest(options);
    }

    if (body) {
      options.body = JSON.stringify(body);

      // If Content-Type header has not been previously set, set to application/json
      options.headers = new Headers(options.headers);
      if (!options.headers.get("Content-Type")) {
        options.headers.set("Content-Type", "application/json; charset=utf-8");
      }
    }

    return await fetch(
      `${this.baseUrl}${path}${params ? `?${this.buildParams(params)}` : ""}`,
      {
        method,
        ...options,
      }
    );
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
