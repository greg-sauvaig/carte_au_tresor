import { useState, useEffect } from 'react';

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min +1)) + min;
}

const genCell = () => {
  const random = getRandomInt(1, 10);
  let cell = (random === 2 || random === 4) ? {type: 'm'} : {type: 'p'};
  if (cell.type == 'p') {
    if (getRandomInt(1, 10) > 8) {
      cell.player = genPlayer();
    }
    if (getRandomInt(1, 5) === 5) {
      cell.treasure = getRandomInt(1, 10);
    }
  }
  return cell;
}

const genPlayer = (index) => {
  const random = getRandomInt(1, 20);
  const moves = ['A','G','D'];
  const orientation = ['N','E','S', 'O'];
  let move = '';
  for (var i = 0; i < random; i++) {
    move += moves[getRandomInt(0, 2)];
  }
  return {
    index,
    name: Math.random().toString(36).substring(7),
    orientation: orientation[getRandomInt(0, 3)],
    treasureCount: 0,
    moves: move,
    dones: '',
  };
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
  const rowSize = getRandomInt(1, 30);
  const columnSize = getRandomInt(1, 30);
  for (var i = 0; i < columnSize; i++) {
    stage.push(genRow(rowSize, columnSize))
  }
  let board = {
    width: rowSize,
    height: columnSize,
    stage,
    treasures: [],
    mountains: [],
    players: [],
  };
  board.treasures = getTreasures(board.stage);
  board.mountains = getMountains(board.stage);
  board.players = getPlayers(board.stage);
  return board;
}

const getTreasures = map => {
  let stack = [];
  for (var y = 0;  y < map.length ; y++) {
    for (var x = 0; x < map[0].length; x++) {
      if ("treasure" in map[y][x]) {
        stack.push({ x, y, nb: map[y][x].treasure});
      }
    }
  }
  return stack;
};

const getMountains = map => {
  let stack = [];
  for (var y = 0;  y < map.length ; y++) {
    for (var x = 0; x < map[0].length; x++) {
      if (map[y][x].type === 'm') {
        stack.push({ x, y });
      }
    }
  }
  return stack;
};

const getPlayers = map => {
  let stack = [];
  for (var y = 0;  y < map.length ; y++) {
    for (var x = 0; x < map[0].length; x++) {
      if ('player' in map[y][x]) {
        stack.push({ ...map[y][x].player, x, y });
      }
    }
  }
  return stack;
};

const useMap = () => {

	const [map, setMap] = useState({
    width: 0,
    height: 0,
    stage: [],
    treasures: [],
    mountains: [],
    players: [],
  });

	const randomMap = () => genStage();

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
          alert('error match M');
        }
        board.stage[parseInt(line[2], 10)][parseInt(line[1], 10)] = {type: 'm'};
      }

      else if (line[0].match('T')) {
        if (parseInt(line[1], 10) < 0 || parseInt(line[1], 10) >= board.width ||
          parseInt(line[2], 10) < 0 || parseInt(line[2], 10) >= board.height || 
          parseInt(line[3], 10) < 1
        ) {
          alert('error match T');
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
        if (!line[1].match('[a-z0-9]+') ||
          parseInt(line[2], 10) < 0 || parseInt(line[2], 10) >= board.width ||
          parseInt(line[3], 10) < 0 || parseInt(line[3], 10) >= board.height || 
          !line[4].match('[NSEO]') || line[4].match('[NSEO]').length !== 1 ||
          !line[5].match('[AGD].*')
        ) {
          alert('error match A');
        }
        board.stage[parseInt(line[3], 10)][parseInt(line[2], 10)] = {
          ...board.stage[parseInt(line[3], 10)][parseInt(line[2], 10)],
          player: {
            index: playersOrder,
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

  const updatePlayerPos = prev => {
    let stage = prev.stage;

    let players = prev.players;
    let player = players[0];
    console.log(prev.players);
    let moves = player.moves.split('');
    if (moves.length < 1) {
      return;
    }
    let move = moves.shift();
    moves = moves.join('');

    const MOVES_MATRIX = {
      N: { 
        x: 0,
        y: -1,
      },
      E:{ 
        x: 1,
        y: 0,
      },
      S:{ 
        x: 0,
        y: 1,
      },
      O:{
        x: -1,
        y: 0,
      },
    };
    const ORIENTATION_MATRIX = {
      N: { G: 'O', D: 'E'},
      E: { G: 'N', D: 'S'},
      S: { G: 'E', D: 'O'},
      O: { G: 'S', D: 'N'},
    };

    if (move === 'A') {
      if (!playerCollide(
          prev,
          (MOVES_MATRIX[player.orientation].x + player.x),
          (MOVES_MATRIX[player.orientation].y + player.y)
        )
      ) {
        /* remove player from previous position */
        delete stage[player.y][player.x].player;
        /* update player internal position */
        player.x = MOVES_MATRIX[player.orientation].x + player.x;
        player.y = MOVES_MATRIX[player.orientation].y + player.y;
        // update treasure count for cell and player
        if ('treasure' in stage[player.y][player.x]) {
          stage[player.y][player.x] = { 
            ...stage[player.y][player.x],
            treasure: stage[player.y][player.x].treasure - 1,
          };
          player.treasureCount = player.treasureCount + 1;
          if (stage[player.y][player.x].treasure < 1) {
            delete stage[player.y][player.x].treasure;
          }
        }
        /* insert player in next position on the stage */
        stage[player.y][player.x] = { 
          ...stage[player.y][player.x],
          player: player,
        };

      }
    } else if (move === 'G' || move === 'D') {
      player.orientation = ORIENTATION_MATRIX[player.orientation][move];
      stage[player.y][player.x] = { 
        ...stage[player.y][player.x],
        player: player,
      };
    }

    //players.shift();
    //console.log(players[0]);
    player.dones = `${player.dones}${move}`;
    player = { ...player, moves };
    players = players.filter((player, id) => id !== 0);
    //console.log(players);
    players.push(player);
    const treasures = getTreasures(stage);

    // console.log(players, prev, {
    //   ...prev,
    //   players,
    //   stage,
    // });
    console.log({...prev}, {
      ...prev,
      players,
      stage,
      treasures,
    })
    setMap({
      ...prev,
      players,
      stage,
      treasures,
    });
  }

  const playerCollide = (map, x, y) => {
    if (x < 0 || x >= map.width) {
      console.log('x out of boundaries ', x);
      return true;
    }
    if (y < 0 || y >= map.height) {
      console.log('y out of boundaries ', y);
      return true;
    }
    if (map.stage[y][x].type === 'm') {
      console.log('player want to learn to climb');
      return true;
    }
    if ('player' in map.stage[y][x]) {
      console.log('already occupied by another player ', map.stage[y][x].player.name);
      return true;
    }
    return false;
  }

	return [map, setMap, randomMap, parseFileLoadMap, updatePlayerPos];
}

export default useMap;