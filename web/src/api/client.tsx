import { createContext, useContext, useMemo } from "react";
import axios, { AxiosInstance, AxiosError } from "axios";
import useLocalStorage from "react-use-localstorage";
import { shared } from "../config";
import { AsyncResult } from "./async";

const useAuthTokenStorage = () => useLocalStorage("memezer-token", "");

export type Client = {
  isAuthenticated: boolean;
  login(
    username: string,
    password: string
  ): Promise<AsyncResult<void, AxiosError>>;
  register(
    username: string,
    email: string,
    password: string,
    confirm: string
  ): Promise<AsyncResult<void, AxiosError>>;
  logout: () => Promise<AsyncResult<void, AxiosError>>;
  api: AxiosInstance;
};

export const ClientContext = createContext<Client | null>(null);

export const useClient = (): Client => {
  const client = useContext(ClientContext);

  if (client == null) {
    throw new Error("Cannot `useClient` outside of a client context.");
  }

  return client;
};

export const ClientProvider: React.FC = ({ children }) => {
  const [token, setToken] = useAuthTokenStorage();

  const value: Client = useMemo(() => {
    const logout = async () => {
      setToken("");
      return AsyncResult.success({ data: void 0 });
    };
    const api = axios.create({
      baseURL: shared.API_BASE,
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    });

    api.interceptors.response.use(
      async (resp) => resp,
      async (error) => {
        if (error.response?.status === 401) {
          await logout();
        }
        throw error;
      }
    );
    return {
      isAuthenticated: Boolean(token),
      async login(username: string, password: string) {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);

        const response = await api.post(`/auth/login`, formData);

        setToken(response.data.access_token);

        return AsyncResult.success({ data: void 0 });
      },
      async register(
        username: string,
        email: string,
        password: string,
        confirm: string
      ) {
        const response = await api.post(
          `/auth/register`,
          JSON.stringify({
            username,
            email,
            password,
            confirm_password: confirm,
          })
        );

        setToken(response.data.token.access_token);

        return AsyncResult.success({ data: void 0 });
      },
      logout,
      api,
    };
  }, [setToken, token]);

  return (
    <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
  );
};
