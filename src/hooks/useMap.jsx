import { useState } from 'react';

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min +1)) + min;
}

const genCell = () => {
  const random = getRandomInt(1, 10);
  return (random === 2 || random === 4) ? {type: "m"} : {type: "p"};
}

const genRow = (cellNumber) => {
  let row = [];
  for (var i = 0; i < cellNumber; i++) {
    row.push(genCell())
  }
  return row;
}

const genStage = () => {
  let stage = [];
  const vertexSize = getRandomInt(1, 30);
  for (var i = 0; i < vertexSize; i++) {
    stage.push(genRow(vertexSize))
  }
  return stage;
}

const useMap = () => {
	const [map, setMap] = useState({stage: genStage()});
	const randomMap = () => ({ stage: genStage()});
  const parseFileLoadMap = (content) => {
    let lines = content.split(/\r?\n/);
    let mapLine = lines.shift().split(' - ');
    window.mapLine = mapLine;
    if (!mapLine[0].match('C') || parseInt(mapLine[1], 10) < 1 || parseInt(mapLine[2], 10) < 1) {
      alert('error');
    }
    console.log(mapLine);
    let board = {
      width: parseInt(mapLine[1], 10),
      height: parseInt(mapLine[2], 10),
      stage: [],
    };
    board.stage =  Array.from(
      Array(board.height),
      () => new Array(board.width).fill({type: 'p'})
    );
    
    for (var i = 0; i < lines.length; i++) {
      let line = lines[i].split(' - ');

      if (line[0].match('M')) {
        if (parseInt(line[1], 10) < 0 || parseInt(line[1], 10) >= board.width ||
          parseInt(line[2], 10) < 0 || parseInt(line[2], 10) >= board.height ) {
          alert('error');
        }
        board.stage[parseInt(line[1], 10)][parseInt(line[2], 10)] = {type: 'm'};
      }
      else if (line[0].match('T')) {
        if (parseInt(line[1], 10) < 0 || parseInt(line[1], 10) >= board.width ||
          parseInt(line[2], 10) < 0 || parseInt(line[2], 10) >= board.height || 
          parseInt(line[3], 10) < 1
        ) {
          alert('error');
        }
        board.stage[parseInt(line[2], 10)][parseInt(line[1], 10)] = {
          type: board.stage[parseInt(line[2], 10)][parseInt(line[1], 10)].type,
          treasure: parseInt(line[3], 10),
        };
        board.stage[parseInt(line[2], 10)][parseInt(line[1], 10)] = {
          ...board.stage[parseInt(line[2], 10)][parseInt(line[1], 10)],
          
        };
      }

      else if (line[0].match('A')) {
        if (!line[1].match('[azAZ].*') ||
          parseInt(line[2], 10) < 0 || parseInt(line[2], 10) >= board.width ||
          parseInt(line[3], 10) < 0 || parseInt(line[3], 10) >= board.height || 
          !line[4].match('[NSEO]') || line[4].match('[NSEO]').length !== 1 ||
          !line[5].match('[AGD].*')
        ) {
          alert('error');
        }
        board.stage[parseInt(line[3], 10)][parseInt(line[2], 10)] = {
          ...board.stage[parseInt(line[3], 10)][parseInt(line[2], 10)],
          player: {
            index: i,
            orientation: line[4],
            treasureCount: 0,
            moves: line[5]
          }
        };
      }
    }
    //console.log(board.stage);
    setMap(board);
  }
	return [map, setMap, randomMap, parseFileLoadMap];
}

export default useMap;