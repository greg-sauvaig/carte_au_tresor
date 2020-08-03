export const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min +1)) + min;
}

class Counter {
  constructor() {
    this.count = 0;
  }
  increaseCount() {
    this.count += 1;
  }
  getCount() {
    return this.count;
  }
  resetCount() {
    this.count = 0;
  }
}
let counter = new Counter();

export const genCell = () => {
  const random = getRandomInt(1, 10);
  let cell = (random === 2 || random === 4) ? {type: 'm'} : {type: 'p'};
  if (cell.type === 'p') {
    if (getRandomInt(1, 10) > 8) {
      cell.player = genPlayer();
    }
    if (getRandomInt(1, 5) === 5) {
      cell.treasure = getRandomInt(1, 10);
    }
  }
  return cell;
}

export const genPlayer = () => {
  let index = counter.getCount();
  counter.increaseCount();
  const random = getRandomInt(1, 20);
  const moves = ['A','G','D'];
  const orientation = ['N','E','S', 'O'];
  let move = '';
  for (var i = 0; i < random; i++) {
    move += moves[getRandomInt(0, 2)];
  }
  return {
    id: index,
    name: Math.random().toString(36).substring(7),
    orientation: orientation[getRandomInt(0, 3)],
    treasureCount: 0,
    moves: move,
    dones: '',
  };
}

export const genRow = (cellNumber) => {
  let row = [];
  for (var i = 0; i < cellNumber; i++) {
    row.push(genCell())
  }
  return row;
}

export const genStage = () => {
  counter.resetCount();
  let stage = [];
  const rowSize = getRandomInt(1, 50);
  const columnSize = getRandomInt(1, 50);
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

export const getTreasures = map => {
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

export const getMountains = map => {
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

export const getPlayers = map => {
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

export const MOVES_MATRIX = {
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

export const ORIENTATION_MATRIX = {
  N: { G: 'O', D: 'E'},
  E: { G: 'N', D: 'S'},
  S: { G: 'E', D: 'O'},
  O: { G: 'S', D: 'N'},
};

export const playerCollide = (map, x, y) => {
  if (x < 0 || x >= map.width) {
    //console.log('x out of boundaries ', x);
    return true;
  }
  if (y < 0 || y >= map.height) {
    //console.log('y out of boundaries ', y);
    return true;
  }
  if (map.stage[y][x].type === 'm') {
    //console.log('player want to learn to climb');
    return true;
  }
  if ('player' in map.stage[y][x]) {
    //console.log('already occupied by another player ', map.stage[y][x].player.name);
    return true;
  }
  return false;
};

export const isFinished = (players) => {
  for (var i = 0; i < players.length; i++) {
    if (players[i].moves !== '') {
      return false;
    }
  }
  return true;
};

export const runStep = (map, playerIndex) => {
  let prevBoard = JSON.parse(JSON.stringify(map));
  let stage = prevBoard.stage;
  let players = prevBoard.players;
  let player = players[playerIndex];
  //console.log('update', player.name, playerIndex);
  let moves = player.moves.split('');
  if (moves.length) {
    let move = moves.shift();
    moves = moves.join('');
    player.dones = `${player.dones}${move}`;
    player = { ...player, moves };
    if (move === 'A') {
      if (!playerCollide(
          prevBoard,
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
  }
  players[playerIndex] = player;
  return {
    ...prevBoard,
    players,
    stage,
    treasures: getTreasures(stage),
  };
};

export const solve = (map) => {
  let prev = JSON.parse(JSON.stringify(map));
  let index = 0;
  while (!isFinished(prev.players)) {
    prev = runStep(prev, index % prev.players.length);
    index++;
  }
  return prev;
};

export const resolveStep = (map, index) => {
  let prev = JSON.parse(JSON.stringify(map));
  if (!isFinished(prev.players)) {
    prev = runStep(prev, index);
  }
  return prev;
};

export const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};