import React, { useRef } from "react";
import { StyledButton } from './StyledButton';

class StartButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClickBtn = this.handleClickBtn.bind(this);
  }
  handleClickBtn() {
    this.props.start();
  }
  render() {
    return (
      <StyledButton 
        className="button"
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
