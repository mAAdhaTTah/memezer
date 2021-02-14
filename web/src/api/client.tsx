import { createContext, useContext, useMemo } from "react";
import axios from "axios";
import { useAuth } from "../auth";
import { shared } from "../config";

const ClientContext = createContext(axios.create());

export const ClientProvider: React.FC = ({ children }) => {
  const { token, logout } = useAuth();
  const client = useMemo(() => {
    const client = axios.create({
      baseURL: shared.API_BASE,
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    });

    client.interceptors.response.use(
      async (resp) => resp,
      async (error) => {
        if (error.response?.status === 401) {
          await logout();
        }
        throw error;
      }
    );

    return client;
  }, [logout, token]);

  return (
    <ClientContext.Provider value={client}>{children}</ClientContext.Provider>
  );
};

export const useClient = () => useContext(ClientContext);
