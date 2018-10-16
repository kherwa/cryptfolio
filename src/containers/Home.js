import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";
import {
  selectCurrency,
  fetchFolio,
  fetchPrices,
  fetchBalances,
  addCoin,
  removeCoin,
  transferFolio,
  storeFolio,
  getTransactionConfirmation
} from "../actions";
import deepEqual from "fast-deep-equal";
import ErrorPage from "../components/ErrorPage";
import PassPhraseModal from "../components/PassPhraseModal";
import PassPhraseConfirmModal from "../components/PassPhraseConfirmModal";
import Balances from "../components/Balances";
import GCoinTable from "../components/GCoinTable";
import "./Home.css";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPassModal: false,
      showPassConfirmModal: false,
      isModified: false
    };
  }

  onModalShow = () => {
    this.setState({ showPassModal: true });
  };

  onModalClose = () => {
    this.setState({ showPassModal: false });
  };

  onModalPassConfirmShow = () => {
    this.setState({ showPassConfirmModal: true });
  };

  onModalPassConfirmClose = () => {
    this.setState({ showPassConfirmModal: false });
  };

  onPassPhrase = passPhrase => {
    const {
      dispatch,
      contractInstance,
      selectedAccount,
      storedHash,
      folio,
      isFetching,
      isUpdating
    } = this.props;
    if (isUpdating && Object.keys(folio).length)
      dispatch(
        transferFolio(folio, contractInstance, selectedAccount, passPhrase)
      );
    if (!isFetching) dispatch(fetchFolio(storedHash, passPhrase));

    this.onModalClose();
  };

  onConfirmPassPhrase = passPhrase => {
    const {
      dispatch,
      contractInstance,
      selectedAccount,
      folio,
      isUpdating
    } = this.props;
    if (isUpdating && Object.keys(folio).length)
      dispatch(
        transferFolio(folio, contractInstance, selectedAccount, passPhrase)
      );
    this.onModalPassConfirmClose();
  };

  componentDidMount() {
    const { storedHash, folio, errors } = this.props;
    if (storedHash && storedHash !== "newfolio") {
      if (!folio || !Object.keys(folio).length || errors.length) {
        this.setState({ showPassModal: true });
      }
    }

    this.priceInterval = setInterval(() => {
      const { dispatch, folio } = this.props;
      if (Object.keys(folio).length) dispatch(fetchPrices());
    }, 10000);

    this.balanceInterval = setInterval(() => {
      const { dispatch, folio } = this.props;
      if (Object.keys(folio).length) dispatch(fetchBalances(folio));
    }, 50000);

    this.transactionInterval = setInterval(() => {
      const { dispatch, lastTxHash, web3js } = this.props;
      if (lastTxHash) dispatch(getTransactionConfirmation(lastTxHash, web3js));
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.priceInterval);
    clearInterval(this.balanceInterval);
    clearInterval(this.transactionInterval);
  }

  componentDidUpdate(prevProps, prevState) {
    const { storedHash, initialfolio, folio } = this.props;

    if (!prevState.isModified && !deepEqual(initialfolio, folio))
      this.setState({ isModified: true });

    if (prevState.isModified && deepEqual(initialfolio, folio))
      this.setState({ isModified: false });

    if (
      !prevState.showPassModal &&
      storedHash &&
      storedHash !== "newfolio" &&
      !prevProps.errors.length
    ) {
      if (!initialfolio || !Object.keys(initialfolio).length) {
        this.setState({ showPassModal: true });
      }
    }
  }

  handleCurrencyChange = currency => {
    this.props.dispatch(selectCurrency(currency));
  };

  handleCoinRemoval = address => {
    this.props.dispatch(removeCoin(address));
  };

  handleCoinAddition = coin => {
    this.props.dispatch(addCoin(coin));
  };

  handleTransfer = () => {
    this.props.dispatch(storeFolio());
    //  this.setState({ isModified: false });
    this.onModalPassConfirmShow();
  };

  render() {
    const {
      selectedCurrency,
      errors,
      folio,
      balances,
      tokens,
      folioBalance,
      prices,
      rates
    } = this.props;

    if (errors.length) return <ErrorPage errors={errors} />;
    else
      return (
        <div>
          <PassPhraseModal
            show={this.state.showPassModal}
            onClose={this.onModalClose}
            onSubmit={this.onPassPhrase}
          />

          <PassPhraseConfirmModal
            show={this.state.showPassConfirmModal}
            onClose={this.onModalPassConfirmClose}
            onSubmit={this.onConfirmPassPhrase}
          />

          <Balances
            value={folioBalance}
            currency={selectedCurrency}
            onChange={this.handleCurrencyChange}
          />
          <GCoinTable
            coins={folio}
            prices={prices}
            rates={rates}
            balances={balances}
            tokens={tokens}
            onCoinRemove={this.handleCoinRemoval}
            onCoinAdd={this.handleCoinAddition}
            currency={selectedCurrency}
          />
          <div className="Home center">
            <Button
              bsStyle="success"
              disabled={!this.state.isModified}
              onClick={this.handleTransfer}
            >
              {" "}
              Transfer to Blockchain{" "}
            </Button>
          </div>
        </div>
      );
  }
}

Home.propTypes = {
  errors: PropTypes.array,
  selectedCurrency: PropTypes.string.isRequired,
  selectedAccount: PropTypes.string.isRequired,
  storedHash: PropTypes.string.isRequired,
  initialfolio: PropTypes.object,
  folio: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  balances: PropTypes.object.isRequired,
  folioBalance: PropTypes.number.isRequired,
  prices: PropTypes.object.isRequired,
  rates: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  const {
    selectedCurrency,
    initialisedWeb3,
    updatedState,
    exchangeRates
  } = state;
  const { web3js, contractInstance } = initialisedWeb3;
  const {
    selectedAccount,
    storedHash,
    initialfolio,
    folio,
    balances,
    tokens,
    prices,
    lastTxHash,
    errors,
    isFetching,
    isUpdating
  } = updatedState;

  const { rates } = exchangeRates;

  let folioBalance = 0;
  if (balances && Object.keys(balances).length) {
    for (let coin in balances) {
      let price = 0;
      if (prices && Object.keys(prices).length) {
        switch (selectedCurrency) {
          case "USD":
            price = parseFloat(prices[coin].price_usd);
            break;
          case "EUR":
            price = parseFloat(prices[coin].price_eur);
            break;
          case "BTC":
            price = parseFloat(prices[coin].price_btc);
            break;
          default:
            if (rates && Object.keys(rates).length)
              price = parseFloat(
                prices[coin].price_usd * rates[selectedCurrency]
              );
        }
      }
      balances[coin].map(balance => (folioBalance += balance * price));
    }
    if (tokens && Object.keys(tokens).length) {
      for (let coin in tokens) {
        for (let token in tokens[coin]) {
          let price = 0;
          switch (selectedCurrency) {
            case "USD":
              price = tokens[coin][token].price;
              break;
            case "BTC":
              price = parseFloat(
                tokens[coin][token].price / prices.BTC.price_usd
              );
              break;
            default:
              if (rates && Object.keys(rates).length)
                price = parseFloat(
                  tokens[coin][token].price * rates[selectedCurrency]
                );
          }

          folioBalance += tokens[coin][token].balance * price;
        }
      }
    }
  }

  return {
    web3js,
    contractInstance,
    selectedCurrency,
    selectedAccount,
    storedHash,
    initialfolio,
    folio,
    balances,
    tokens,
    folioBalance,
    prices,
    rates,
    lastTxHash,
    errors,
    isFetching,
    isUpdating
  };
}

export default connect(mapStateToProps)(Home);
