import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import NewArticle from "./containers/NewArticle";
import Articles from "./containers/Articles";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/login">
        <Login />
      </Route>
      <Route exact path="/articles/new">
        <NewArticle />
      </Route>
      <Route exact path="/articles/:id">
        <Articles />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}
