/* eslint-disable @typescript-eslint/no-explicit-any */

export type URLSearchParamsInit = Record<string, any>;

export type BodyInitOrObject =
  | BodyInit
  | {
      [key: string]: any;
    };

export enum StatusCode {
  Ok = 200,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500,
}
