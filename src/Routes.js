import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './containers/Home';
import NotFound from './containers/NotFound';
import Login from './containers/Login';
import NewArticle from './containers/NewArticle';
import Articles from './containers/Articles';
import Settings from './containers/Settings';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import UnauthenticatedRoute from './components/UnauthenticatedRoute';

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <UnauthenticatedRoute exact path="/login">
        <Login />
      </UnauthenticatedRoute>
      <AuthenticatedRoute exact path="/settings">
        <Settings />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/articles/new">
        <NewArticle />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/articles/:id">
        <Articles />
      </AuthenticatedRoute>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}
