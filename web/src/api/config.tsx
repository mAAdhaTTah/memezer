import { AxiosError, AxiosRequestConfig } from "axios";
import { useMemo } from "react";
import { ConfigInterface, SWRConfig } from "swr";
import { useClient } from "./client";

export const SwrConfigProvider: React.FC = ({ children }) => {
  const client = useClient();
  const config: ConfigInterface<
    unknown,
    AxiosError,
    (url: string, config: AxiosRequestConfig) => any
  > = useMemo(
    () => ({
      dedupingInterval: process.env.NODE_ENV === "test" ? 0 : 2000,
      fetcher: (url, params) =>
        client.get(url, params).then((resp) => resp.data),
    }),
    [client]
  );
  return <SWRConfig value={config}>{children}</SWRConfig>;
};
