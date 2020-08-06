/**
 * getRandomInt to get a random integer between limit parameters
 * 
 * @param  {int} min a number lower limit
 * @param  {int} max a number upper limit
 * @return {int} a random number between min and max
 */
export const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min +1)) + min;
}

/**
 * Class Counter to share a counter between function call
 */
export class Counter {
  constructor() {
    this.count = 0;
  }
  increaseCount() {
    this.count += 1;
    return this;
  }
  getCount() {
    return this.count;
  }
  resetCount() {
    this.count = 0;
    return this;
  }
}
let counter = new Counter();

/**
 * genCell to generate a random cell for the board
 * 
 * @return {object} a cell object { type: 'm'|'p', ?player, ?treasure }
 */
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

/**
 * genCell to generate a random player for the board
 * 
 * @return {object} a player object sutch as {
 *    id: {int},
 *    name: {string},
 *    orientation: {string}='N'|'E'|'S'|'O',
 *    treasureCount: {int},
 *    moves: {string},
 *    dones: {string},
 *  }
 */
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

/**
 * genRow to generate an array of cell representing a row in the board
 * 
 * @param  {int} size of the row
 * @return {array} the generated array containing cells 
 */
export const genRow = (cellNumber) => {
  let row = [];
  for (var i = 0; i < cellNumber; i++) {
    row.push(genCell())
  }
  return row;
}

/**
 * genStage to generate a random board
 * 
 * @return {array} the generated board {
 *   width: {int},
 *   height: {int},
 *   stage: {array [row[cell]]},
 *   treasures: {array},
 *   mountains: {array},
 *   players: {array},
 * }
 */
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

/**
 * getTreasures to build treasure list based on map parameter
 *
 * @param  {array} the map containing rows and cells
 * @return {array} the built treasure list based on map
 */
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

/**
 * getMountains to build mountains list based on map parameter
 * 
 * @param  {array} the map containing rows and cells
 * @return {array} the built mountains list based on map
 */
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

/**
 * getPlayers to build players list based on map parameter
 * 
 * @param  {array} the map containing rows and cells
 * @return {array} the built players list based on map
 */
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

/**
 * utilitary matrix to represent all possible moves for a player
 * based on the direction, pointing to the related x,y coordinate operation
 * for each move.
 */
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

/**
 * utilitary matrix to represent all possible moves for a player
 * based on the orientation, pointing to all the possible orientation change.
 */
export const ORIENTATION_MATRIX = {
  N: { G: 'O', D: 'E'},
  E: { G: 'N', D: 'S'},
  S: { G: 'E', D: 'O'},
  O: { G: 'S', D: 'N'},
  
};

/**
 * playerCollide to say if the player 'collide' with a move restriction.
 * A player could collide if:
 *  - try to reach a coordinate outside the board
 *  - try to reach a mountains cell
 *  - try to reach a player already occupy the cell
 *  
 * @param  {array} the board map
 * @param  {int} x coordinates the player want to reach
 * @param  {int} y coordinates the player want to reach
 * @return {boolean} player is colliding
 */
export const playerCollide = (map, x, y) => {
  if (x < 0 || x >= map.width) {
    return true;
  }
  if (y < 0 || y >= map.height) {
    return true;
  }
  if (map.stage[y][x].type === 'm') {
    return true;
  }
  if ('player' in map.stage[y][x]) {
    return true;
  }
  return false;
};

/**
 * isFinished to calculate if all the player moves have been resolved
 * @param  {array} player object list
 * @return {boolean} board is resolved
 */
export const isFinished = (players) => {
  for (var i = 0; i < players.length; i++) {
    if (players[i].moves !== '') {
      return false;
    }
  }
  return true;
};

/**
 * runStep to resolve one move on the map 
 * for the player based in the map.players list identified by the index param
 * 
 * @param  {array} the board to apply the moove
 * @param  {int} player index in the player list in the board
 * @return {array} the generated board 
 */
export const runStep = (map, playerIndex) => {
  let prevBoard = JSON.parse(JSON.stringify(map));
  let stage = prevBoard.stage;
  let players = prevBoard.players;
  let player = players[playerIndex];
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

/**
 * solve to solve the board
 *
 * @param  {array} the board to solve
 * @return {array} solved board
 */
export const solve = (map) => {
  let prev = JSON.parse(JSON.stringify(map));
  let index = 0;
  while (!isFinished(prev.players)) {
    prev = runStep(prev, index % prev.players.length);
    index++;
  }
  return prev;
};

/**
 * solve to solve one board step
 *
 * @param  {array} the board to solve
 * @return {array} solved board
 */
export const resolveStep = (map, index) => {
  let prev = JSON.parse(JSON.stringify(map));
  if (!isFinished(prev.players)) {
    prev = runStep(prev, index);
  }
  return prev;
};
