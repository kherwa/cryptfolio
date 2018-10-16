const infura = {
  mainnet: "https://mainnet.infura.io/<api-key>",
  ropsten: "https://ropsten.infura.io/<api-key>",
  rinkeby: "https://rinkeby.infura.io/<api-key>",
  kovan: "https://kovan.infura.io/<api-key>",
  ipfs: {
    host: "ipfs.infura.io",
    port: "5001",
    protocol: "https",
    gateway: "https://ipfs.infura.io"
  }
};
const local = {
  provider: "http://127.0.0.1:8545",
  ipfs: {
    host: "127.0.0.1",
    port: "5001",
    protocol: "http",
    gateway: "http://127.0.0.1:8080/"
  }
};
const provider = infura;
const contract = {
  address: "0x56e219ab01f70fc75c570b3ca98220d594b281f2",
  abi: [
    {
      anonymous: false,
      inputs: [{ indexed: false, name: "user", type: "address" }],
      name: "HashUpdated",
      type: "event"
    },
    {
      constant: false,
      inputs: [{ name: "hash", type: "string" }],
      name: "store",
      outputs: [],
      payable: true,
      stateMutability: "payable",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "getStoredHash",
      outputs: [{ name: "hash", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    }
  ]
};

const coinlist = ["BTC", "ETH", "ZEC", "EOS", "DCR"];

const coininfo = {
  BTC: {
    id: 1,
    name: "Bitcoin",
    balanceApi: [
      "https://api.blockcypher.com/v1/btc/main/addrs/",
      "https://blockchain.info/q/addressbalance/",
      "https://blockchain.info/balance?active="
    ],
    apiSuffix: ["/balance", "", ""],
    explorer: ["https://www.blockchain.com/btc/address/"]
  },
  ETH: {
    id: 1027,
    name: "Ethereum",
    balanceApi: ["https://api.ethplorer.io/getAddressInfo/"],
    apiSuffix: ["?apiKey=freekey"],
    explorer: ["https://etherscan.io/address/"]
  },
  ZEC: {
    id: 1437,
    name: "Zcash",
    balanceApi: ["https://api.zcha.in/v2/mainnet/accounts/"],
    apiSuffix: [""],
    explorer: ["https://explorer.zcha.in/accounts/"]
  },
  EOS: {
    id: 1765,
    name: "EOS",
    balanceApi: [
      "https://hapi.eosrio.io/v1/chain/get_account",
      "https://api.eosmonitor.io/v1/accounts/"
    ],
    apiSuffix: ["", ""],
    explorer: ["https://eospark.com/MainNet/account/"]
  },
  DCR: {
    id: 1168,
    name: "Decred",
    balanceApi: ["https://mainnet.decred.org/api/addr/"],
    apiSuffix: ["/?noTxList=1"],
    explorer: ["https://mainnet.decred.org/address/"]
  }
};

const priceApi = [
  "https://coincap.io/page/",
  "https://api.coinmarketcap.com/v2/ticker/?convert="
];

const currlist = ["USD", "EUR", "JPY", "INR", "BTC"];

const exchangeRatesApi = ["https://ratesapi.io/api/latest?base=USD"];

const networks = {
  1: "Mainnet",
  3: "Ropsten",
  4: "Rinkeby",
  42: "Kovan"
};

export {
  infura,
  local,
  contract,
  coinlist,
  coininfo,
  priceApi,
  currlist,
  networks,
  exchangeRatesApi,
  provider
};
