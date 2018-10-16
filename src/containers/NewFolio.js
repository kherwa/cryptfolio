import React from "react";
import { connect } from "react-redux";
import { Jumbotron, Button } from "react-bootstrap";
import { receiveStoredHash } from "../actions";

const NewFolio = ({ onClick }) => {
  return (
    <Jumbotron>
      <div className="NewFolio">
        <div className="lander">
          <h1>CryptFolio</h1>

          <p>
            <Button bsStyle="primary" bsSize="large" onClick={onClick}>
              Build
            </Button>{" "}
            Cryptocurrency Portfolio{" "}
          </p>
        </div>
      </div>
    </Jumbotron>
  );
};
const mapDispatchToProps = dispatch => ({
  onClick: () => {
    dispatch(receiveStoredHash("newfolio"));
  }
});
export default connect(
  undefined,
  mapDispatchToProps
)(NewFolio);
