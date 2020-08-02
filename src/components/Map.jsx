import React from "react";
import { StyledMap } from './StyledMap';
import Cell from './Cell';

class Map extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      this.props.height + this.props.width > 0 &&
      <StyledMap height={this.props.height} width={this.props.width}>
        {
          this.props.stage.map(
            row => row.map(
              (cell, x) => {
                console.log(cell.player);
                return (<Cell type={cell.type} treasure={cell.treasure} key={x} player={cell.player}/>);
              }
            )
          )
        }
      </ StyledMap>
    );
  }
}

export default React.memo(Map);
