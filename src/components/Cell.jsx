import React from "react";
import { StyledCell } from './StyledCell';
import Player from './Player';

class Cell extends React.Component {
  render () { 
    return (
      <StyledCell type={this.props.type} treasure={this.props.treasure}>
      	{
      		this.props.player &&
      		<Player {...this.props.player} /> 
      	}
      </StyledCell>
    );
  }
}

export default Cell;