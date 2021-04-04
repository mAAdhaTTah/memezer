import { Switch, Route } from "react-router-dom";
import { Login, Register, LOGIN, REGISTER } from "../auth";
import { Upload, UPLOAD } from "../upload";
import { View as HomeView, HOME } from "../home";
import { NotFound } from "../errors";
import { EDIT, View as EditView } from "../edit";

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
      <Route
        exact
        path={EDIT}
        render={({ match }) => <EditView memeId={match.params.memeId} />}
      />
      <Route exact path={HOME}>
        <HomeView />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
};
