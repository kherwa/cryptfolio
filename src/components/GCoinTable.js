import React, { Component } from "react";
import { Table, Button } from "react-bootstrap";
import GCoinAdd from "./GCoinAdd";
import { coininfo, coinlist } from "../config/params";
import "./GCoinTable.css";

export default class GCoinTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      disabled: false,
      style: "hidden",
      buttonlabel: "Remove"
    };
  }
  onRemoveCoins = () => {
    if (this.state.buttonlabel === "Remove")
      this.setState({ disabled: true, style: "", buttonlabel: "Done" });
    else
      this.setState({
        disabled: false,
        style: "hidden",
        buttonlabel: "Remove"
      });
  };

  onDeleteCoin = e => {
    const coinStr = e.target.value;
    const splitStr = coinStr.split("#");
    const coin = {
      ticker: splitStr[0],
      addr: splitStr[1]
    };
    this.props.onCoinRemove(coin);
  };

  onAddCoin = coin => {
    this.props.onCoinAdd(coin);
  };

  onModalShow = () => {
    this.setState({ show: true, disabled: true });
  };

  onModalClose = () => {
    this.setState({ show: false, disabled: false });
  };

  buildTableRows() {
    const { coins, prices, rates, balances, tokens } = this.props;
    let rows = [];
    let key = 0;
    if (coins && Object.keys(coins).length) {
      for (let coin in coins) {
        coins[coin].map((addr, i) => {
          let coinStr = coin.concat("#", addr);

          let price = 0,
            balance = 0,
            value = 0;

          if (balances && balances.hasOwnProperty(coin)) {
            balance = parseFloat(balances[coin][i]).toPrecision(5);
          }
          if (prices && Object.keys(prices).length) {
            switch (this.props.currency) {
              case "USD":
                price = parseFloat(prices[coin].price_usd).toFixed(2);
                value = (balance * price).toFixed(2);
                break;
              case "EUR":
                price = parseFloat(prices[coin].price_eur).toFixed(2);
                value = (balance * price).toFixed(2);
                break;
              case "BTC":
                price = parseFloat(prices[coin].price_btc).toPrecision(5);
                value = (balance * price).toPrecision(5);
                break;
              default:
                price = parseFloat(
                  prices[coin].price_usd * rates[this.props.currency]
                ).toFixed(2);
                value = (balance * price).toFixed(2);
            }
          }
          key++;
          const url = coininfo[coin].explorer[0] + addr;
          const sprite = "sprite-".concat(coininfo[coin].name.toLowerCase());
          
          rows.push(
            <tr key={key}>
              <td> {key} </td>
              <td>
                <div className="pull-left">
                  <p className={sprite} />
                </div>
                <div className="coinname">
                  <p>{coininfo[coin].name}</p>
                </div>
              </td>
              <td>
                <a href={url}>{addr}</a>
              </td>
              <td>{balance}</td>
              <td>
                {price} {this.props.currency}
              </td>
              <td>
                {value} {this.props.currency}
              </td>
              <td className={this.state.style}>
                <Button
                  bsStyle="danger"
                  onClick={this.onDeleteCoin}
                  value={coinStr}
                >
                  {" "}
                  -{" "}
                </Button>
              </td>
            </tr>
          );
        });
      }
    }

    coinlist.map(coin => {
      if (tokens && tokens.hasOwnProperty(coin)) {
        for (let token in tokens[coin]) {
          key++;
          let balance = tokens[coin][token].balance.toPrecision(5);
          let price = 0;
          let value = 0;
          let priceStr = "";
          let valueStr = "";
          switch (this.props.currency) {
            case "USD":
              price = tokens[coin][token].price;
              priceStr = price.toFixed(2);
              value = balance * price;
              valueStr = value.toFixed(2);
              break;
            case "BTC":
              price = parseFloat(
                tokens[coin][token].price / this.props.prices.BTC.price_usd
              );
              priceStr = price.toPrecision(5);
              value = balance * price;
              valueStr = value.toPrecision(5);
              break;
            default:
              price = parseFloat(
                tokens[coin][token].price * rates[this.props.currency]
              );
              priceStr = price.toFixed(2);
              value = balance * price;
              valueStr = value.toFixed(2);
          }

          if (value) {
            const url = coininfo[coin].explorer + tokens[coin][token].address;
            const sprite = "sprite-".concat(token.toLowerCase());
              
            rows.push(
              <tr key={key}>
                <td> {key} </td>
                <td>
                  <div className="pull-left">
                    <p className={sprite} />
                  </div>
                  <div className="coinname">
                    <p>{tokens[coin][token].name}</p>
                  </div>
                </td>
                <td>
                  <a href={url}>{tokens[coin][token].address}</a>
                </td>
                <td>{balance}</td>
                <td>
                  {priceStr} {this.props.currency}
                </td>
                <td>
                  {valueStr} {this.props.currency}
                </td>
              </tr>
            );
          }
        }
      }
    });

    return rows;
  }
  render() {
    let rows = [];
    rows = this.buildTableRows();
    return (
      <div className="cointable">
        <Table responsive bordered condensed>
          <thead>
            <tr>
              <th>#</th>
              <th>Coin</th>
              <th>Address</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Value</th>
              <th className={this.state.style} />
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>

        <div className="pull-right">
          <Button
            bsStyle="primary"
            onClick={this.onModalShow}
            disabled={this.state.disabled}
          >
            {" "}
            Add{" "}
          </Button>
          <span className="space" />
          <Button bsStyle="danger" onClick={this.onRemoveCoins}>
            {" "}
            {this.state.buttonlabel}{" "}
          </Button>
        </div>

        <GCoinAdd
          show={this.state.show}
          onClose={this.onModalClose}
          onSave={this.onAddCoin}
        />
      </div>
    );
  }
}
