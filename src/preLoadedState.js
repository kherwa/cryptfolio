import Web3 from "web3";
import { contract } from "./config/params";

function initialiseWeb3() {
  if (!window.web3) return {};
  const web3js = new Web3(window.web3.currentProvider);
  const contractInstance = web3js.eth
    .contract(contract.abi)
    .at(contract.address);
  return {
    web3js: web3js,
    contractInstance: contractInstance
  };
}
const exchangeRates = { rates: {} };
const initialState = {
  selectedAccount: "",
  selectedNetwork: "",
  isFetchingHash: false,
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

export const preLoadedState = {
  selectedCurrency: "INR",
  initialisedWeb3: initialiseWeb3(),
  updatedState: initialState,
  exchangeRates: exchangeRates
};
