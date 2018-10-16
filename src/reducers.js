import { combineReducers } from "redux";
import { networks } from "./config/params";
import {
  SELECT_ACCOUNT,
  SELECT_NETWORK,
  SELECT_CURRENCY,
  GET_EXCHANGE_RATES,
  REQUEST_FOLIO,
  REQUEST_STORED_HASH,
  RECEIVE_STORED_HASH,
  RECEIVE_FOLIO,
  REQUEST_BALANCES,
  RECEIVE_BALANCES,
  REQUEST_PRICES,
  RECEIVE_PRICES,
  ADD_COIN,
  REMOVE_COIN,
  STORE_FOLIO,
  RECEIVE_TXHASH,
  RECEIVE_IPFSHASH,
  LOG_ERROR,
  TRANSACTION_CONFIRMED
} from "./actions";

function selectedCurrency(state = "INR", action) {
  switch (action.type) {
    case SELECT_CURRENCY:
      return action.currency;
    default:
      return state;
  }
}

const initialState = {
  selectedAccount: "",
  selectedNetwork: "",
  storedHash: "",
  initialfolio: {},
  folio: {},
  tokens: {},
  balances: {},
  prices: {},
  isFetching: false,
  messages: [],
  isUpdating: false,
  lastTxHash: "",
  errors: []
};

function initialisedWeb3(state = {}) {
  return state;
}

function exchangeRates(state = { rates: {} }, action) {
  if (action.type === GET_EXCHANGE_RATES)
    return { ...state, rates: action.rates };
  return state;
}

function updatedState(state = initialState, action) {
  switch (action.type) {
    case SELECT_ACCOUNT:
      return {
        ...state,
        selectedAccount: action.account,
        isFetchingHash: true,
        storedHash: "",
        initialfolio: {},
        folio: {},
        balances: {},
        tokens: {},
        errors: []
      };
    //TO-DO  to write logic for unknown networks
    case SELECT_NETWORK:
      return {
        ...state,
        selectedNetwork: networks[action.network],
        isFetchingHash: true,
        storedHash: "",
        initialfolio: {},
        folio: {},
        balances: {},
        tokens: {},
        errors: []
      };
    case REQUEST_STORED_HASH:
      return { ...state, isFetchingHash: true };
    case RECEIVE_STORED_HASH:
      return { ...state, isFetchingHash: false, storedHash: action.hash };
    case REQUEST_FOLIO:
      return {
        ...state,
        isFetching: true,
        initialfolio: {},
        folio: {},
        balances: {},
        tokens: {},
        errors: []
      };
    case RECEIVE_FOLIO:
      return {
        ...state,
        isFetching: false,
        initialfolio: action.folio,
        folio: action.folio,
        errors: []
      };
    case REQUEST_BALANCES:
      return { ...state, isFetchingBalances: true };
    case RECEIVE_BALANCES:
      return {
        ...state,
        isFetchingBalances: false,
        balances: action.balances[0],
        tokens: action.balances[1]
      };
    case REQUEST_PRICES:
      return { ...state, isFetchingPrices: true };
    case RECEIVE_PRICES:
      return {
        ...state,
        isFetchingPrices: false,
        prices: action.prices
      };
    case ADD_COIN:
      const coin = action.coin;
      if (!state.folio[coin.ticker]) {
        const coinObj = {};
        coinObj[coin.ticker] = [coin.addr];
        return { ...state, folio: { ...state.folio, ...coinObj } };
      } else if (
        state.folio[coin.ticker] &&
        state.folio[coin.ticker].indexOf(coin.addr) == -1
      ) {
        const newFolio = { ...state.folio };
        newFolio[coin.ticker] = [...state.folio[coin.ticker], coin.addr];
        return { ...state, folio: newFolio };
      } else return state;
    case REMOVE_COIN:
      const coinRemove = action.coin;
      if (state.folio && state.folio[coinRemove.ticker]) {
        const newFolio = { ...state.folio };
        const index = state.folio[coinRemove.ticker].indexOf(coinRemove.addr);
        if (index > -1) {
          newFolio[coinRemove.ticker] = [...state.folio[coinRemove.ticker]];
          newFolio[coinRemove.ticker].splice(index, 1);
          if (newFolio[coinRemove.ticker].length == 0)
            delete newFolio[coinRemove.ticker];
          return { ...state, folio: newFolio };
        } else return state;
      }

    case STORE_FOLIO:
      return { ...state, isUpdating: true, errors: [] };
    case RECEIVE_TXHASH:
      return { ...state, lastTxHash: action.hash };
    case RECEIVE_IPFSHASH:
      return { ...state, lastIPFSHash: action.hash };
    case LOG_ERROR:
      return {
        ...state,
        isFetching: false,
        errors: [...state.errors, action.errorMessage]
      };
    case TRANSACTION_CONFIRMED:
      return { ...state, isUpdating: false, lastTxHash: "" };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  selectedCurrency,
  initialisedWeb3,
  updatedState,
  exchangeRates
});

export default rootReducer;
