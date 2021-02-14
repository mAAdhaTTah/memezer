import { createContext, useContext, useMemo } from "react";
import useLocalStorage from "react-use-localstorage";

const useAuthTokenStorage = () => useLocalStorage("memezer-token");

export type AuthApi = {
  token: string;
  login(username: string, password: string): Promise<void>;
  register(
    username: string,
    email: string,
    password: string,
    confirm: string
  ): Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthApi>({
  token: "",
  async login() {},
  async register() {},
  async logout() {},
});

export const useAuth = (): AuthApi => useContext(AuthContext);

export const AuthProvider: React.FC = ({ children }) => {
  const [token, setToken] = useAuthTokenStorage();

  const value: AuthApi = useMemo(() => {
    return {
      token,
      async login(username: string, password: string) {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);

        const response = await fetch(
          `${process.env.REACT_APP_API_BASE}/auth/login`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          const body = await response.json();
          setToken(body.access_token);
        } else {
          throw new Error("Problem!");
        }
      },
      async register(
        username: string,
        email: string,
        password: string,
        confirm: string
      ) {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE}/users`,
          {
            method: "POST",
            body: JSON.stringify({
              username,
              email,
              password,
              confirm_password: confirm,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Oh no!");
        }
      },
      async logout() {
        setToken("");
      },
    };
  }, [setToken, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
