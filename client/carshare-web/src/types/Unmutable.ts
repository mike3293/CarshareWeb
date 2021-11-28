export type Unmutable<Type> = {
  +readonly [Property in keyof Type]: Type[Property];
};
