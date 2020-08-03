import { useState } from 'react';
import { getTreasures, getPlayers, getMountains } from '../utils/helpers';

const useMap = () => {

	const [map, setMap] = useState({
    width: 0,
    height: 0,
    stage: [],
    mountains: [],
    treasures: [],
    players: [],
  });

  const parseFileLoadMap = (content) => {
    let lines = content.match(/[^\r\n]+/g);
    let mapLine = lines.shift().split(' - ');
    if (!mapLine[0].match('C') || parseInt(mapLine[1], 10) < 1 || parseInt(mapLine[2], 10) < 1) {
      alert('error');
    }
    let board = {
      width: parseInt(mapLine[1], 10),
      height: parseInt(mapLine[2], 10),
      stage: [],
      treasures: [],
      mountains: [],
      players: [],
    };
    board.stage = Array.from(
      Array(board.height),
      () => new Array(board.width).fill({type: 'p'})
    );
    let playersOrder = 0;
    for (var i = 0; i < lines.length; i++) {
      let line = lines[i].split(' - ');

      if (line[0].match('M')) {
        if (parseInt(line[1], 10) < 0 || parseInt(line[1], 10) >= board.width ||
          parseInt(line[2], 10) < 0 || parseInt(line[2], 10) >= board.height ) {
          alert('error');
        }
        board.stage[parseInt(line[2], 10)][parseInt(line[1], 10)] = {type: 'm'};
      } else if (line[0].match('T')) {
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
      } else if (line[0].match('A')) {
        if (!line[1].match('[a-zA-Z]+') ||
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
            id: playersOrder,
            name: line[1],
            orientation: line[4],
            treasureCount: 0,
            moves: line[5],
            dones: '',
          }
        };
        playersOrder++;
      }
    }
    board.treasures = getTreasures(board.stage);
    board.mountains = getMountains(board.stage);
    board.players = getPlayers(board.stage);
    setMap(board);
  }

	return [map, setMap, parseFileLoadMap];
}

export default useMap;