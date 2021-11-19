import { BodyInitOrObject, URLSearchParamsInit } from "./types";

abstract class ServiceBase {
  baseUrl!: string;

  protected initialize(config: { baseURL: string }) {
    this.baseUrl = config.baseURL;
  }

  // var url =
  //   "https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address";
  // var token = "f6d8ce2e6b793ca55914daa972f6f86132e09d95";
  // var query = { lat: 53.88019160129188, lon: 27.540886106944072, count: 1 };

  // fetch(url, {
  //   method: "POST",
  //   mode: "cors",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Accept: "application/json",
  //     Authorization: "Token " + token,
  //   },
  //   body: JSON.stringify(query),
  // })
  //   .then((response) => response.text())
  //   .then((result) => console.log(result))
  //   .catch((error) => console.log("error", error));

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
