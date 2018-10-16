import React, { Component } from "react";
import { Modal, FormGroup, FormControl, HelpBlock, Button } from "react-bootstrap";

export default class PassPhraseModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      passPhrase: ""
    };
  }
  handleClose = () => {
    this.setState({ passPhrase: "" });
    this.props.onClose();
  };

  handleChange = e => {
    const passPhrase = e.target.value;
    this.setState({ passPhrase: passPhrase });
  };

  handleSubmit = e => {
    e.preventDefault();
    const passPhrase = this.state.passPhrase;
    this.props.onSubmit(passPhrase.trim());
    this.setState({ passPhrase: "" });
  };

  render() {
    return (
      <div>
        <Modal show={this.props.show} onHide={this.props.onClose}>
          <Modal.Header closeButton>
            <Modal.Title>PassPhrase</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={this.handleSubmit}>
              <FormGroup controlId="formControlsAddr">
                <FormControl
                  type="password"
                  placeholder="Enter PassPhrase"
                  onChange={this.handleChange}
                  value={this.state.passPhrase}
                />
                <FormControl.Feedback />
                <HelpBlock>{}</HelpBlock>
              </FormGroup>
              <Button bsStyle="primary" type="submit">Submit</Button>
            </form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
