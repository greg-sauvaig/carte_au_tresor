import React, { useRef } from "react";
import { StyledButton } from './StyledButton';

class FileButton extends React.Component {
  constructor(props) {
    super(props);
    this.fileReader = null;
    this.inputFile = React.createRef();
    this.handleFileClickBtn = this.handleFileClickBtn.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.dipatchFileContent = this.dipatchFileContent.bind(this);
  }
  handleFileClickBtn() {
    this.inputFile.current.click();
  }
  handleFile(file) {
    this.fileReader = new FileReader();
    this.fileReader.onload = this.dipatchFileContent;
    this.fileReader.readAsText(file);
  }
  dipatchFileContent(e) {
    this.props.onLoad(this.fileReader.result);
  }
  render() {
    return (
      <StyledButton 
        className="button"
        onClick={this.handleFileClickBtn}
        onChange={e => this.handleFile(e.target.files[0])}
        >
        <p>
          {this.props.text}
        </p>
        <input type="file" className="hidden" ref={this.inputFile}/>
      </StyledButton>
    );
  }
}

export default FileButton;
