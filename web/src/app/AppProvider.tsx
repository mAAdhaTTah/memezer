import { HashRouter } from "react-router-dom";
import { AuthProvider } from "../auth";
import { SwrConfigProvider, ClientProvider } from "../api";

export const AppProvider: React.FC = ({ children }) => {
  return (
    <HashRouter>
      <AuthProvider>
        <SwrConfigProvider>
          <ClientProvider>{children}</ClientProvider>
        </SwrConfigProvider>
      </AuthProvider>
    </HashRouter>
  );
};
