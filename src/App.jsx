import React, { useState } from 'react';
import './App.css';
import Board from './components/Board';
import useMap from './hooks/useMap';
import useInterval from './hooks/useInterval';
import useGameState from './hooks/useGameState';
import FileButton from './components/FileButton';
import StartButton from './components/StartButton';
import ScoreBoard from './components/ScoreBoard';
import { genStage, solve, resolveStep, isFinished} from './utils/helpers';

const App = () => {

  const [map, setMap, parseFileLoadMap] = useMap();
  const [start, setStart] = useGameState();
  const [step, setStep] = useState(0);

  const fileLoad = (content) => {
    parseFileLoadMap(content);
    resetStep();
  }

  const incrementStep = () => {
    setStep(prev => prev + 1);
  }

  const resetStep = () => {
    setStep(0);
  }

  const tick = () => {
    let next = resolveStep(map, step % map.players.length);
    setMap(next);
    incrementStep();
  }

  const scoreBoard = (map) => ({
    map: {
      x: map.width,
      y: map.height
    },
    treasures: map.treasures,
    mountains: map.mountains,
    players: map.players,
  })

  const onclick = () => {
    setMap(prev => solve(prev));
  }

  const onclickGetResult = () => {
    const result = scoreBoard(solve(map));
    const orderedResult = {
      ...result,
      players: result.players.sort((a, b) => a.id > b.id),
    };
    downloadTxtFile(generateStringFromResult(orderedResult));
  }

  const generateStringFromResult = (board) => {
    let string = '';
    string = `C - ${board.map.x} - ${board.map.y}\r\n`;
    for (var i = 0; i < board.mountains.length; i++) {
      string = `${string}M - ${board.mountains[i].x} - ${board.mountains[i].y}\r\n`;
    }
    for (var j = 0; j < board.treasures.length; j++) {
      string = `${string}T - ${board.treasures[j].x} - ${board.treasures[j].y} - ${board.treasures[j].nb}\r\n`;
    }
    for (var k = 0; k < board.players.length; k++) {
      string = `${string}A - ${board.players[k].name} - ${board.players[k].x} - ${board.players[k].y} - ${map.players[k].orientation} - ${board.players[k].treasureCount}\r\n`;
    }
    return string;
  }

  const downloadTxtFile = (string) => {
    const element = document.createElement('a');
    const file = new Blob([string], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'result.txt';
    document.body.appendChild(element);
    element.click();
  }

  useInterval(
    () => {
      tick();
      if (isFinished(map.players)) {
        setStart(null);
      }
    },
    start
  );

  const play = () => {
    if (start === null) {
      return setStart(500);
    }
    return setStart(null);
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
          onClick={() => setMap(genStage)}
        >
          <p>load random map</p>
        </button>
      </div>
      <div className="App-content">
        <ScoreBoard {...scoreBoard(map)} />
        <Board {...map} />
      </div>
      <div className="App-control">
        <StartButton
          text="+"
          onStart={() => tick()}
          start={start}
        />
        <button className="button" onClick={() => play()}>
          <p>{start === null ? '>' : '□'}</p>
        </button>
        <button 
          className="button" 
          onClick={() => onclick()}
        >
          <p>>></p>
        </button>
        <button
          className="button"
          onClick={() => onclickGetResult()}
        >
          <p>result</p>
        </button>
      </div>
    </div>
  );
}
export default App;
