import React, { Component } from "react";
import { Table, FormGroup, FormControl } from "react-bootstrap";
import { currlist } from "../config/params.js";
import "./Balances.css";
export default class Balances extends Component {
  render() {
    const rows = [];
    let i = 0;
    currlist.map(c => {
      rows.push(
        <option key={i++} value={c}>
          {c}
        </option>
      );
    });
    // <td className="Balances">Currency: </td>
    return (
      <div>
        <Table responsive>
          <tbody>
            <tr>
              <td className="Balances">Balance: </td>
              <td>
                {this.props.value.toFixed(4)} {this.props.currency}
              </td>

              <td>
                <FormGroup controlId="formControlsSelect">
                  <FormControl
                    componentClass="select"
                    value={this.props.currency}
                    onChange={e => this.props.onChange(e.target.value)}
                  >
                    {rows}
                  </FormControl>
                </FormGroup>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }
}
