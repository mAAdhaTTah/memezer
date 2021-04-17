import "./global.css";
import { Box } from "@material-ui/core";
import { Header, Footer } from "../layout";
import { Page } from "./Page";

export const App = () => {
  return (
    <Box display="flex" minHeight="100vh" flexDirection="column">
      <Header />
      <Box component="main" flexGrow="1" display="flex" flexDirection="column">
        <Page />
      </Box>
      <Footer />
    </Box>
  );
};
