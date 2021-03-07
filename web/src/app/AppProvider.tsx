import { HashRouter } from "react-router-dom";
import { SwrConfigProvider, ClientProvider } from "../api";

export const AppProvider: React.FC = ({ children }) => {
  return (
    <HashRouter>
      <ClientProvider>
        <SwrConfigProvider>{children}</SwrConfigProvider>
      </ClientProvider>
    </HashRouter>
  );
};
