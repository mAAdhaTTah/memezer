import { Switch, Route } from "react-router-dom";
import { Login, Register, LOGIN, REGISTER } from "../auth";
import { Upload, UPLOAD } from "../upload";
import { Home, HOME } from "../home";
import { NotFound } from "../errors";

export const Page: React.FC = () => {
  return (
    <Switch>
      <Route exact path={LOGIN}>
        <Login />
      </Route>
      <Route exact path={REGISTER}>
        <Register />
      </Route>
      <Route exact path={UPLOAD}>
        <Upload />
      </Route>
      <Route exact path={HOME}>
        <Home />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
};
