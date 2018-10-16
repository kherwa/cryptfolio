import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import configureStore from "../configureStore";
import { preLoadedState } from "../preLoadedState";
import { fetchExchangeRates } from "../actions";
import App from "./App";

const store = configureStore(preLoadedState);
store.dispatch(fetchExchangeRates());
const Root = () => (
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
);

export default Root;
