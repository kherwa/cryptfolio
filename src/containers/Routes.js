import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./Home";
import NewFolio from "./NewFolio";
import NotFound from "../components/NotFound";
import ErrorPage from "../components/ErrorPage";

export default ({ errors, account, isFetchingHash, hash }) => (
  <Switch>
    <Route
      exact
      path="/"
      render={() => {
        if (errors.length) return <ErrorPage errors={errors} />;
        else if (hash) return <Home />;
        else if (account && !isFetchingHash && !hash) return <NewFolio />;
        else return <div />;
      }}
    />
    <Route component={NotFound} />
  </Switch>
);
