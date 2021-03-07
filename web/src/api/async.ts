import { genericVariant, fields, Variant } from "variant";

export type AsyncStatus<T, E> =
  | Variant<"loading", {}>
  | Variant<"success", { data: T }>
  | Variant<"error", { error: E }>;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AsyncStatus = genericVariant(({ T, E }) => ({
  loading: fields<void>(),
  success: fields<{ data: typeof T }>({ data: T }),
  error: fields<{ error: typeof E }>({ error: E }),
}));

export type AsyncResult<T, E> =
  | Variant<"success", { data: T }>
  | Variant<"error", { error: E }>;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AsyncResult = genericVariant(({ T, E }) => ({
  success: fields<{ data: typeof T }>({ data: T }),
  error: fields<{ error: typeof E }>({ error: E }),
}));
