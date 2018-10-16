import React, { Component } from "react";
import {
  Modal,
  FormGroup,
  FormControl,
  Button,
  ControlLabel
} from "react-bootstrap";
import { coinlist, coininfo } from "../config/params.js";
import "./GCoinAdd.css";

export default class GCoinAdd extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      coin: {
        ticker: "",
        addr: ""
      }
    };
  }

  handleClose = () => {
    const coin = this.state.coin;
    coin.ticker = "";
    coin.addr = "";
    this.props.onClose();
    this.setState({ coin: coin });
  };

  handleTickerChange = e => {
    let coin = this.state.coin;
    coin.ticker = e.target.value;
    this.setState({ coin: coin });
  };

  handleAddrChange = e => {
    let coin = this.state.coin;
    coin.addr = e.target.value;

    this.setState({ coin: coin });
  };

  handleSave = () => {
    //To-Do Check for valid addresses
    const coin = this.state.coin;
    let coinCopy = {
      ticker: coin.ticker,
      addr: coin.addr
    };
    if (coin.ticker && coin.addr) {
      this.props.onSave(coinCopy);
      this.props.onClose();
      coin.ticker = "";
      coin.addr = "";
      this.setState({ coin: coin });
    }
  };

  getValidationState = () => {
    let addrLength = this.state.coin.addr.length;
    if (addrLength > 33) return "success";
    else if (addrLength > 0) return "error";
    else return null;
  };

  render() {
    const rows = [];
    let i = 0;
    rows.push(
      <option key={i++} value="">
        Select a Coin
      </option>
    );
    coinlist.map(c => {
      rows.push(
        <option key={i++} value={c}>
          {coininfo[c].name}
        </option>
      );
    });
    return (
      <div>
        <Modal show={this.props.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Coin</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <FormGroup controlId="formControlsSelect">
                <FormControl
                  componentClass="select"
                  onChange={this.handleTickerChange}
                >
                  {rows}
                </FormControl>
              </FormGroup>
              <FormGroup
                controlId="formControlsAddr"
                validationState={this.getValidationState()}
              >
                <ControlLabel>Coin Address</ControlLabel>
                <FormControl
                  type="text"
                  placeholder="Coin Address"
                  value={this.state.coin.addr}
                  onChange={this.handleAddrChange}
                />
              </FormGroup>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="primary" onClick={this.handleSave}>
              Add
            </Button>
            <Button bsStyle="danger" onClick={this.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
