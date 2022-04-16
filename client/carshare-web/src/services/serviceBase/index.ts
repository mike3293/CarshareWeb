import { BodyInitOrObject, StatusCode, URLSearchParamsInit } from "./types";
import { toast } from "react-toastify";

const notify = (error: string) => toast(error, { type: "error" });

abstract class ServiceBase {
  baseUrl!: string;
  protected willSendRequest?(request: RequestInit): void | Promise<void>;
  protected refreshSession?(): void | Promise<void>;

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

    try {
      const result = await response.json();

      return result;
    } catch {
      return null as unknown as TResult;
    }
  }

  protected async put<TResult>(
    path: string,
    body?: BodyInitOrObject,
    params?: URLSearchParamsInit,
    init?: RequestInit
  ): Promise<TResult> {
    const response = await this.fetch(path, "PUT", params, body, init);

    try {
      const result = await response.json();

      return result;
    } catch (err) {
      return null as unknown as TResult;
    }
  }

  private async fetch(
    path: string,
    method: string,
    params?: URLSearchParamsInit,
    body?: BodyInitOrObject,
    options: RequestInit = {},
    shouldRefreshSession = true
  ): Promise<Response> {
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

    const response = await fetch(
      `${this.baseUrl}${path}${params ? `?${this.buildParams(params)}` : ""}`,
      {
        method,
        ...options,
      }
    );

    if (
      response.status === StatusCode.Unauthorized &&
      shouldRefreshSession &&
      this.refreshSession
    ) {
      await this.refreshSession();

      return await this.fetch(path, method, params, body, options, false);
    }

    if (response.status !== StatusCode.Ok) {
      notify(`Request to '${path}' failed`);
    }

    return response;
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
