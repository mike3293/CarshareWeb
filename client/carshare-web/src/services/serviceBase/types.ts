/* eslint-disable @typescript-eslint/no-explicit-any */

export type URLSearchParamsInit =
  | URLSearchParams
  | string
  | Record<string, any>;

export type BodyInitOrObject =
  | BodyInit
  | {
      [key: string]: any;
    };
