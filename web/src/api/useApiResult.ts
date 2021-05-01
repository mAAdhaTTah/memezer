import { AxiosError } from "axios";
import { useMemo } from "react";
import { Struct, StructError, validate } from "superstruct";
import useSwr, { mutate } from "swr";
import { AsyncStatus } from "./async";

export type ApiError = StructError | AxiosError;

type MutateCallback = (data: unknown, revalidate?: boolean) => Promise<void>;

export type ApiResult<T> = {
  result: AsyncStatus<T, ApiError>;
  mutate: MutateCallback;
};

export const useApiResult = <T, S>(
  url: string,
  struct: Struct<T, S>
): ApiResult<T> => {
  const { data, error } = useSwr<unknown, AxiosError>(url);

  const result = useMemo(() => {
    if (data) {
      const result = validate(data, struct, { coerce: true });

      if (result[0] != null) {
        return AsyncStatus.error({ error: result[0] });
      }

      return AsyncStatus.success({ data: result[1] });
    }

    if (error) {
      return AsyncStatus.error({ error });
    }

    return AsyncStatus.loading();
  }, [data, error, struct]);

  return {
    result,
    mutate: (data: unknown, revalidate?: boolean) =>
      mutate(url, data, revalidate),
  };
};
