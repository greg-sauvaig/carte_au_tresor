import React from 'react';
import logo from './logo.svg';
import './App.css';
import Board from './components/Board';
import useMap from './hooks/useMap';
import useInterval from './hooks/useInterval';
import useGameState from './hooks/useGameState';
import FileButton from './components/FileButton';
import StartButton from './components/StartButton';
import ScoreBoard from './components/ScoreBoard';

const App = () => {

  const [map, setMap, randomMap, parseFileLoadMap, updatePlayerPos] = useMap();
  const [dropTime, setDropTime] = useGameState();
  const next = () => {
    updatePlayerPos(map);
  }
  useInterval(
    () => {
      next();
    },
    dropTime
  );

  const startPause = (dropTime) => {
    if (dropTime === null) {
      return setDropTime(10);
    }
    setDropTime(null)
  }

  const fileLoad = (content) => {
    setDropTime(null);
    return parseFileLoadMap(content);
  }

  const scoreBoard =  {
    map: {
      x: map.width,
      y: map.height
    },
    treasures: map.treasures,
    mountains: map.mountains,
    players: map.players,
  }

  return (
    <div className="App">
      <div className="App-menu">
        <FileButton
          text={"Load Map File"}
          onLoad={fileLoad}
        />
        <button
          className="button"
          onClick={() => setMap(randomMap)}
        >
          <p>load random map</p>
        </button>
      </div>
      <div className="App-content">
        <ScoreBoard {...scoreBoard} />
        <Board {...map} />
      </div>
      <div className="App-control">

        <StartButton
          text={dropTime === null ? "start" : "stop"}
          start={() => startPause(dropTime)}
        />

        <button className="button">
          <p>fastforward</p>
        </button>
        <button className="button">
          <p>result</p>
        </button>
      </div>
    </div>
  );
}
export default App;
