import { AxiosError, AxiosRequestConfig } from "axios";
import { useMemo } from "react";
import { ConfigInterface, SWRConfig } from "swr";
import { useClient } from "./client";

type AppConfig = ConfigInterface<
  unknown,
  AxiosError,
  (url: string, config: AxiosRequestConfig) => any
>;

export const SwrConfigProvider: React.FC<{
  config?: AppConfig;
}> = ({ config = {}, children }) => {
  const { api } = useClient();

  const value: AppConfig = useMemo(
    () => ({
      fetcher: (url, params) => api.get(url, params).then((resp) => resp.data),
      ...config,
    }),
    [config, api]
  );
  return <SWRConfig value={value}>{children}</SWRConfig>;
};
