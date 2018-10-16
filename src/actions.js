import IpfsStore from "./ipfs/IpfsStore";
import EncDec from "./openpgp/EncDec";
import Notification from "./notify";
import {
  coinlist,
  priceApi,
  exchangeRatesApi,
  coininfo
} from "./config/params";
export const SELECT_ACCOUNT = "SELECT_ACCOUNT";
export const SELECT_NETWORK = "SELECT_NETWORK";
export const SELECT_CURRENCY = "SELECT_CURRENCY";
export const GET_EXCHANGE_RATES = "GET_EXCHANGE_RATES";
export const REQUEST_STORED_HASH = "REQUEST_STORED_HASH";
export const RECEIVE_STORED_HASH = "RECEIVE_STORED_HASH";
export const REQUEST_FOLIO = "REQUEST_FOLIO";
export const RECEIVE_FOLIO = "RECEIVE_FOLIO";
export const REQUEST_BALANCES = "REQUEST_BALANCES";
export const RECEIVE_BALANCES = "RECEIVE_BALANCES";
export const REQUEST_PRICES = "REQUEST_PRICES";
export const RECEIVE_PRICES = "RECEIVE_PRICES";
export const ADD_COIN = "ADD_COIN";
export const REMOVE_COIN = "REMOVE_COIN";
export const STORE_FOLIO = "STORE_FOLIO";
export const RECEIVE_IPFSHASH = "RECEIVE_IPFSHASH";
export const RECEIVE_TXHASH = "RECEIVE_TXHASH";
export const TRANSACTION_CONFIRMED = "TRANSACTION_CONFIRMED";
export const LOG_ERROR = "LOG_ERROR";

export function selectAccount(account) {
  return {
    type: SELECT_ACCOUNT,
    account
  };
}

export function selectNetwork(network) {
  return {
    type: SELECT_NETWORK,
    network
  };
}

export function selectCurrency(currency) {
  return {
    type: SELECT_CURRENCY,
    currency
  };
}

function getExchangeRates(rates) {
  return {
    type: GET_EXCHANGE_RATES,
    rates
  };
}

export function fetchExchangeRates() {
  return async dispatch => {
    const response = await fetch(exchangeRatesApi);
    const json = await response.json();
    dispatch(getExchangeRates(json.rates));
  };
}

function requestFolio() {
  return {
    type: REQUEST_FOLIO
  };
}

function requestStoredHash() {
  return {
    type: REQUEST_STORED_HASH
  };
}

export function receiveStoredHash(hash) {
  return {
    type: RECEIVE_STORED_HASH,
    hash
  };
}

function receiveFolio(json) {
  return {
    type: RECEIVE_FOLIO,
    folio: json
  };
}

function requestBalances() {
  return {
    type: REQUEST_BALANCES
  };
}

function receiveBalances(balances) {
  return {
    type: RECEIVE_BALANCES,
    balances: balances
  };
}

function requestPrices() {
  return {
    type: REQUEST_PRICES
  };
}

function receivePrices(prices) {
  return {
    type: RECEIVE_PRICES,
    prices: prices
  };
}
export function addCoin(coin) {
  return {
    type: ADD_COIN,
    coin
  };
}

export function removeCoin(coin) {
  return {
    type: REMOVE_COIN,
    coin
  };
}

export function storeFolio() {
  return {
    type: STORE_FOLIO
  };
}

function receiveTxHash(hash) {
  return {
    type: RECEIVE_TXHASH,
    hash
  };
}

function receiveIPFSHash(hash) {
  return {
    type: RECEIVE_IPFSHASH,
    hash
  };
}

function logError(errorMessage) {
  return {
    type: LOG_ERROR,
    errorMessage
  };
}

function transactionConfirmed() {
  return {
    type: TRANSACTION_CONFIRMED
  };
}

export function getTransactionConfirmation(txHash, web3js) {
  return dispatch => {
    web3js.eth.getTransactionReceipt(txHash, (error, receipt) => {
      if (!error && receipt != null) {
        dispatch(transactionConfirmed());
        if (Notification.permission === "granted") {
          let notification = new Notification(txHash, {
            body: TRANSACTION_CONFIRMED,
            tag: "CryptFolio"
          });

          notification.onclick = function() {
            this.close();
          };
          setTimeout(notification.close.bind(notification), 5000);
        }
      }
    });
  };
}

export function fetchStoredHash(contractInstance, account, network) {
  return async dispatch => {
    if (!account) dispatch(logError("MetaMask: Unlock & Select Account"));
    else if (network !== "3")
      dispatch(logError("MetaMask: Select Ropsten TestNet"));
    else {
      dispatch(requestStoredHash());
      // Get IPFS file Hash from smart contract
      contractInstance.getStoredHash.call({ from: account }, (error, hash) => {
        if (error) dispatch(logError("Contract:" + error));
        else dispatch(receiveStoredHash(hash));
      });
    }
  };
}
//TO-DO Check folio with JSON Schema
export function fetchFolio(hash, passCode) {
  return async dispatch => {
    dispatch(requestFolio());
    try {
      const json = await getFolio(dispatch, hash, passCode);
      dispatch(receiveFolio(json));
      dispatch(fetchBalances(json));
      dispatch(fetchPrices());
    } catch (error) {}
  };
}

export function fetchBalances(folio) {
  return async dispatch => {
    dispatch(requestBalances());
    const balances = await getBalances(folio);
    dispatch(receiveBalances(balances));
  };
}

export function fetchPrices() {
  return async dispatch => {
    dispatch(requestPrices());
    const prices = await getPrices();
    dispatch(receivePrices(prices));
  };
}

export function transferFolio(folio, contractInstance, account, passCode) {
  return dispatch => {
    let folioStr = JSON.stringify(folio);
    EncDec.encrypt(folioStr, passCode)
      .then(buffer => {
        IpfsStore.add(buffer)
          .then(hash => {
            dispatch(receiveIPFSHash(hash));
            contractInstance.store(
              hash,
              { from: account, gas: 100000 },
              function(error, txHash) {
                if (error) dispatch(logError("Contract:" + error));
                else dispatch(receiveTxHash(txHash));
              }
            );
          })
          .catch(error => {
            dispatch(logError("IPFS:" + error));
          });
      })
      .catch(error => {
        dispatch(logError("EncDec:" + error));
      });
  };
}

function getFolio(dispatch, hash, passCode) {
  return new Promise((resolve, reject) => {
    // get IPFS file
    IpfsStore.get(hash)
      .then(content => {
        // return Decrypted file
        EncDec.decrypt(content, passCode)
          .then(decrypted => {
            const folio = JSON.parse(decrypted);
            resolve(folio);
          })
          .catch(error => {
            dispatch(logError("EncDec:" + error));
            reject(error);
          });
      })
      .catch(error => {
        dispatch(logError("IPFS:" + error));
        reject(error);
      });
  });
}

async function getPrices() {
  const prices = {};
  const promiseArray = coinlist.map(async coin => {
    const url = priceApi[0] + coin;
    const json = await fetch(url)
      .then(response => response.json())
      .catch(err => console.log(err));
    const obj = {
      price_usd: json.price,
      price_btc: json.price_btc,
      price_eur: json.price_eur
    };
    prices[coin] = obj;
    return prices;
  });
  return Promise.all(promiseArray).then(v => {
    return v[v.length - 1];
  });
}

async function getBalances(folio) {
  const balances = {};
  const tokens = {};
  let outerPromiseArray = [];
  for (let coin in folio) {
    balances[coin] = new Array(folio[coin].length).fill(0);
    tokens[coin] = {};
    let innerPromiseArray = folio[coin].map(async (addr, i) => {
      let balance = 0;
      if (coin === "EOS") {
        const url = coininfo[coin].balanceApi[0];
        const data = { account_name: addr };
        const json = await fetch(url, {
          method: "POST",
          body: JSON.stringify(data)
        })
          .then(response => response.json())
          .catch(err => console.log(err));
        const liquid = json.core_liquid_balance.split(" ");
        const cpustake = json.total_resources.cpu_weight.split(" ");
        const netstake = json.total_resources.net_weight.split(" ");
        balance =
          parseFloat(liquid[0]) +
          parseFloat(cpustake[0]) +
          parseFloat(netstake[0]);
      } else {
        const url =
          coininfo[coin].balanceApi[0] + addr + coininfo[coin].apiSuffix[0];
        const json = await fetch(url)
          .then(response => response.json())
          .catch(err => console.log(err));
        switch (coin) {
          case "BTC":
            balance = json.balance / 100000000;
            break;
          case "ETH":
            balance = json.ETH.balance;
            if (json.hasOwnProperty("tokens")) {
              let tokenPrice = 0;
              let tokenBalance = 0;
              let tokenSymbol;
              json.tokens.map((token, i) => {
                if (token.tokenInfo.price)
                  tokenPrice = parseFloat(token.tokenInfo.price.rate);
                else tokenPrice = 0;
                tokenBalance =
                  parseFloat(token.balance) /
                  10 ** parseInt(token.tokenInfo.decimals);
                tokenSymbol = token.tokenInfo.symbol;
                if (tokens[coin][tokenSymbol]) {
                  tokenBalance += tokens[coin][tokenSymbol].balance;
                }
                tokens[coin][tokenSymbol] = {
                  ...tokens[coin][tokenSymbol],
                  name: token.tokenInfo.name,
                  address: token.tokenInfo.address,
                  balance: tokenBalance,
                  price: tokenPrice,
                  coinAddress: addr
                };
              });
            }

            break;
          case "ZEC":
            balance = json.balance;
            break;
          case "DCR":
            balance = json.balance;
            break;
          default:
        }
      }
      balances[coin][i] = balance;
      return [balances, tokens];
    });
    const p = Promise.all(innerPromiseArray).then(v => v[v.length - 1]);
    outerPromiseArray.push(p);
  }
  return Promise.all(outerPromiseArray).then(v => v[v.length - 1]);
}
