import { useEffect, useState } from "react";
import { Role } from "src/types/Role";

export enum Policy {
  CanManageConfiguration,
}

type PoliciesPayloads = {
  [Policy.CanManageConfiguration]: { role?: Role };
};

export function useAuthorization<T extends Policy>(
  policy: T,
  payload: PoliciesPayloads[T]
): boolean {
  switch (policy) {
    case Policy.CanManageConfiguration:
      return payload.role == Role.Admin;
    default:
      return false;
  }
}
