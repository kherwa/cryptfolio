import React, { Component } from "react";
import { Modal, FormGroup, FormControl, HelpBlock, Button } from "react-bootstrap";

export default class PassPhraseConfirmModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      passPhrase: "",
      confirmPassPhrase: "",
      help: ""
    };
  }

  handleClose = () => {
    this.props.onClose();
    this.setState({ passPhrase: "", confirmPassPhrase: "", help: "" });
  };

  handleChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const passPhrase = this.state.passPhrase;
    if (passPhrase !== "" && passPhrase === this.state.confirmPassPhrase) {
      this.props.onSubmit(passPhrase.trim());
      this.setState({ passPhrase: "", confirmPassPhrase: "" });
    }
  };

  getValidationLength = () => {
    let passPhrase = this.state.passPhrase;
    if (passPhrase.length > 19) return "success";
    else if (passPhrase.length > 0) return "warning";
    else return null;
  };

  getValidationState = () => {
    const passPhrase = this.state.passPhrase;
    if (passPhrase === "" || this.state.confirmPassPhrase === "") return null;
    else if (passPhrase > 19 && passPhrase === this.state.confirmPassPhrase)
      return "success";
    else if (passPhrase === this.state.confirmPassPhrase) return "warning";
    else return "error";
  };

  render() {
    return (
      <div>
        <Modal show={this.props.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Encryption PassPhrase</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={this.handleSubmit}>
              <FormGroup
                controlId="passPhrase"
                validationState={this.getValidationLength()}
              >
                <FormControl
                  type="password"
                  placeholder="Enter PassPhrase"
                  onChange={this.handleChange}
                  value={this.state.passPhrase}
                />
                <FormControl.Feedback />
              </FormGroup>
              <FormGroup
                controlId="confirmPassPhrase"
                validationState={this.getValidationState()}
              >
                <FormControl
                  type="text"
                  placeholder="Confirm PassPhrase"
                  onChange={this.handleChange}
                  value={this.state.confirmPassPhrase}
                />
                <FormControl.Feedback />
                <HelpBlock>{this.state.help}</HelpBlock>
              </FormGroup>
              <Button bsStyle="primary" type="submit">Submit</Button>
            </form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
