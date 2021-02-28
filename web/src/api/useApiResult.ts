import { AxiosError } from "axios";
import { useMemo } from "react";
import { Struct, StructError, validate } from "superstruct";
import useSwr from "swr";
import { AsyncStatus } from "./async";

export type ApiError = StructError | AxiosError;

export const useApiResult = <T, S>(
  url: string,
  struct: Struct<T, S>
): AsyncStatus<T, ApiError> => {
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

  return result;
};
