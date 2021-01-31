import { HashRouter } from "react-router-dom";
import { AuthProvider } from "../auth";

export const AppProvider: React.FC = ({ children }) => {
  return (
    <HashRouter>
      <AuthProvider>{children}</AuthProvider>
    </HashRouter>
  );
};
