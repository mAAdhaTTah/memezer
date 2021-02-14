import { HashRouter } from "react-router-dom";
import { AuthProvider } from "../auth";
import { SwrConfigProvider, ClientProvider } from "../api";

export const TestProvider: React.FC = ({ children }) => {
  return (
    <HashRouter>
      <AuthProvider>
        <SwrConfigProvider config={{ dedupingInterval: 0 }}>
          <ClientProvider>{children}</ClientProvider>
        </SwrConfigProvider>
      </AuthProvider>
    </HashRouter>
  );
};
