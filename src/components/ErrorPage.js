import React from "react";
import "./ErrorPage.css";

export default ({ errors }) => (
  <div className="ErrorPage">
    <h3> {errors} </h3>
  </div>
);
