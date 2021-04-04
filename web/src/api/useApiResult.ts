import { AxiosError } from "axios";
import { useMemo } from "react";
import { Struct, StructError, validate } from "superstruct";
import useSwr, { mutate } from "swr";
import { AsyncStatus } from "./async";

export type ApiError = StructError | AxiosError;

type MutateCallback<T> = (data: T) => Promise<T>;

export type ApiResult<T> = {
  result: AsyncStatus<T, ApiError>;
  mutate: MutateCallback<T>;
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

  return { result, mutate: (data: T) => mutate(url, data) };
};
