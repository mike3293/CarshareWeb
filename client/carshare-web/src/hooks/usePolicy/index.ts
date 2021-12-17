import { Role } from "src/types/Role";

export enum Policy {
  CanManageConfiguration,
}

type PoliciesPayloads = {
  [Policy.CanManageConfiguration]: { role?: Role };
};

export function usePolicy<T extends Policy>(
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
