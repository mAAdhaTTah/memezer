import { HashRouter } from "react-router-dom";
import { SwrConfigProvider, ClientProvider } from "../api";

export const TestProvider: React.FC = ({ children }) => {
  return (
    <HashRouter>
      <ClientProvider>
        <SwrConfigProvider config={{ dedupingInterval: 0 }}>
          {children}
        </SwrConfigProvider>
      </ClientProvider>
    </HashRouter>
  );
};
