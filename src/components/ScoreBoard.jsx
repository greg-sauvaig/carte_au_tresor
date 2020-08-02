import React from "react";
import { StyledScoreBoard } from './StyledScoreBoard';

class ScoreBoard extends React.Component {
  constructor(props) {
    super(props);
  }
  orderedPlayers(players) {
    return players.sort( (a, b) => a.index > b.index );
  }
  render () {
    const players = this.orderedPlayers(this.props.players);
    return (
      this.props.map.x + this.props.map.y > 0 &&
      <div>
        <StyledScoreBoard>
          <div key="m">{`C - ${this.props.map.x} - ${this.props.map.y}`}</div>
          {
            this.props.mountains.map(
              (mountain, index) => <div key={`m-${index}`}>{`M - ${mountain.x} - ${mountain.y}`}</div>
            )
          }
          {
            this.props.treasures.map(
              (treasure, index) => <div key={`t-${index}`}>{`T - ${treasure.x} - ${treasure.y} - ${treasure.nb}`}</div>
            )
          }
          {
            players.map(
              (player, index) => <div key={`a-${index}`}>{`A - ${player.name} - ${player.x} - ${player.y} - ${player.orientation} - ${player.dones}${player.moves}`}</div>
            )
          }
        </StyledScoreBoard>
        {
          players && 
          <StyledScoreBoard >
          {
            players.map(
              (player, index) => <div key={`a-${index}`}>{`A - ${player.name} - ${player.x} - ${player.y} - ${player.orientation} - ${player.treasureCount}`}</div>
            )
          }
          </StyledScoreBoard>
        }
      </div>
    );
  }
}

export default ScoreBoard;