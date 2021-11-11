import { URLSearchParamsInit } from "./types";

abstract class ServiceBase {
  protected async get<TResult>(
    path: string,
    params?: URLSearchParamsInit,
    init?: RequestInit
  ): Promise<TResult> {
    const response = await fetch(path + new URLSearchParams(params), {
      method: "GET",
      ...init,
    });

    return await response.json();
  }
}

export default ServiceBase;
