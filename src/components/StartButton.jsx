import React from "react";
import { StyledButton } from './StyledButton';

class StartButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClickBtn = this.handleClickBtn.bind(this);
  }
  handleClickBtn() {
    this.props.onStart();
  }
  render() {
    return (
      <StyledButton 
      className={`button${this.props.start === null ? ' disabled' : ''}`}
        onClick={this.handleClickBtn}
      >
        <p>
          {this.props.text}
        </p>
      </StyledButton>
    );
  }
}

export default StartButton;
