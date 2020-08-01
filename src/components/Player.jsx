import React from "react";
import { StyledPlayer } from './StyledPlayer';

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.getClassOrientation = this.getClassOrientation.bind(this);
  }
  getClassOrientation() {
  	let names = {
	  	N: 'top',
	  	E: 'right',
	  	S: 'bottom',
	  	O: 'left',
  	};
  	return `player ${names[this.props.orientation]}`;
  }
  render () { 
  	let className = this.getClassOrientation();
    return (
      <StyledPlayer className={className} name={this.props.name} treasureCount={this.props.treasureCount} orientation={this.props.orientation} />
    );
  }
}

export default Player;