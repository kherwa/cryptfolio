import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Navbar } from "react-bootstrap";
import PropTypes from "prop-types";
import { networks } from "../config/params";
import { selectAccount, selectNetwork, fetchStoredHash } from "../actions";
import Routes from "./Routes";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.accountInterval = setInterval(() => {
      const {
        dispatch,
        web3js,
        contractInstance,
        selectedAccount,
        selectedNetwork
      } = this.props;
      if (
        selectedAccount !== web3js.eth.accounts[0] ||
        selectedNetwork !== networks[web3js.version.network]
      ) {
        dispatch(selectAccount(web3js.eth.accounts[0]));
        dispatch(selectNetwork(web3js.version.network));
        dispatch(
          fetchStoredHash(
            contractInstance,
            web3js.eth.accounts[0],
            web3js.version.network
          )
        );
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.accountInterval);
  }

  render() {
    const {
      selectedAccount,
      selectedNetwork,
      errors,
      isFetchingHash,
      storedHash
    } = this.props;
    return (
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">CryptFolio</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Navbar.Text pullRight>
              Network:
              {selectedNetwork}
            </Navbar.Text>
            <Navbar.Text pullRight>
              Account:
              {selectedAccount}
            </Navbar.Text>
          </Navbar.Collapse>
        </Navbar>
        <Routes
          errors={errors}
          account={selectedAccount}
          isFetchingHash={isFetchingHash}
          hash={storedHash}
        />
      </div>
    );
  }
}

App.propTypes = {
  selectedAccount: PropTypes.string,
  selectedNetwork: PropTypes.string,
  isFetchingHash: PropTypes.bool,
  storedHash: PropTypes.string,
  errors: PropTypes.array,
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  const { initialisedWeb3, updatedState } = state;
  const { web3js, contractInstance } = initialisedWeb3;
  const {
    selectedAccount,
    selectedNetwork,
    isFetchingHash,
    storedHash,
    errors
  } = updatedState;

  return {
    web3js,
    contractInstance,
    selectedAccount,
    selectedNetwork,
    isFetchingHash,
    storedHash,
    errors
  };
}

export default connect(mapStateToProps)(App);
