import {
  getRandomInt,
  Counter,
  genCell,
  genPlayer,
  genRow,
  genStage,
  getTreasures,
  getMountains,
  getPlayers,
  playerCollide,
  isFinished,
  runStep,
  solve
} from './helpers'

expect.extend({
  oneOf(value, set) {
    for (var i = 0; i < set.length; i++) {
      if (set[i] == value) {
        return {
          message: () =>
            `expected ${value} to be one of [${set}] `,
          pass: true,
        };
      }
    }
    return {
      message: () =>
        `expected ${value} not to be one of [${set}] `,
      pass: false,
    };
  },
});

describe('getRandomInt', () => {
  describe('should return a number between range', () => {
    it('should return number accordingly to the range', () => {
      let random =  getRandomInt(0, 1);
      expect([0, 1]).toContain(random);
      random =  getRandomInt(0, 5);
      expect([0, 1, 2, 3, 4 ,5]).toContain(random);
      random =  getRandomInt(0, 0);
      expect([0]).toContain(random);
      random =  getRandomInt(4, 4);
      expect([4]).toContain(random);
    });
  });
});

describe('Counter', () => {
  describe('should correctly return count', () => {
    it('should fetch availabilities correctly',  () => {
      let counter =  new Counter();
      expect(counter.getCount()).toBe(0);
      expect(counter.increaseCount().getCount()).toBe(1);
      expect(counter.increaseCount().getCount()).toBe(2);
      expect(counter.increaseCount().getCount()).toBe(3);
      expect(counter.resetCount().getCount()).toBe(0); 
    });
  });
});

describe('genCell', () => {
  it('should generate a valid cell', () => {
    let cell = genCell();
    expect(cell).toHaveProperty('type');
    expect(['p', 'm']).toContain(cell.type);
    expect(cell.type).oneOf(['p', 'm']);
  });
});

describe('genPlayer', () => {
  it('should generate a valid player object', () => {
    let player = genPlayer();
    expect(player).toHaveProperty('id');
    expect(player.id).toBeGreaterThan(-1);
    expect(player).toHaveProperty('name');
    expect(typeof player.name).toBe('string');
    expect(player).toHaveProperty('orientation');
    expect(player.orientation).oneOf(['N','S','E','O']);
    expect(player).toHaveProperty('treasureCount');
    expect(player.treasureCount).toBe(0);
    expect(player).toHaveProperty('moves');
    expect(player.moves).toMatch(/[ADG]+/);
    expect(player).toHaveProperty('dones');
    expect(player.dones).toBe('');
  });
});

describe('genRow', () => {
  it('should generate a valid row array', () => {
    let row = genRow(10);
    expect(row.length).toBe(10);
  });
});

describe('genStage', () => {
  it('should generate a valid stage object', () => {
    const board = genStage();
    expect(board).toHaveProperty('width');
    expect(board.width).toBeGreaterThan(-1);
    expect(board).toHaveProperty('height');
    expect(board.height).toBeGreaterThan(-1);
    expect(board).toHaveProperty('stage');
    expect(board.stage.length).toBeGreaterThan(0);
    expect(typeof board.stage).toBe(typeof []);
    expect(board).toHaveProperty('treasures');
    expect(typeof board.treasures).toBe(typeof []);
    expect(board).toHaveProperty('mountains');
    expect(typeof board.mountains).toBe(typeof []);
    expect(board).toHaveProperty('players');
    expect(typeof board.players).toBe(typeof []);
  });
});


describe('getTreasures', () => {
  it('should generate a valid treasure array', () => {
    let treasures = getTreasures([[],[],[]]);
    expect(treasures).toEqual([]);
    treasures = getTreasures([
      [{},{treasure: 2},{}],
      [{},{},{}],
      [{},{treasure: 1},{}]
    ]);
    expect(treasures).toEqual([
      { x: 1, y: 0, nb: 2},
      { x: 1, y: 2, nb: 1}
    ]);
    treasures = getTreasures([
      [{},{treasure: 2},{}],
      [{},{},{treasure: 3}],
      [{},{treasure: 1},{}],
      [{},{treasure: 1},{}]
    ]);
    expect(treasures).toEqual([
      { x: 1, y: 0, nb: 2},
      { x: 2, y: 1, nb: 3},
      { x: 1, y: 2, nb: 1},
      { x: 1, y: 3, nb: 1}
    ]);
  })
});

describe('getMountains', () => {
  it('should generate a valid mountain array', () => {
    let mountains = getMountains([]);
    expect(mountains).toEqual([]);
    mountains = getMountains([[{},{},{}], [{},{},{}]]);
    expect(mountains).toEqual([]);
    mountains = getMountains([
      [{type: 'p'}, {type: 'm'}, {type: 'p'}, {type: 'p'}, {type: 'm'}, {type: 'p'}],
      [{type: 'p'}, {type: 'p'}, {type: 'p'}, {type: 'm'}, {type: 'm'}, {type: 'p'}],
    ]);
    expect(mountains).toEqual([
      {x: 1, y:0 },
      {x: 4, y:0 },
      {x: 3, y:1 },
      {x: 4, y:1 },
    ]);
    mountains = getMountains([
      [{}, {type: 'm'}, {type: 'p'}, {type: 'p'}, {}, {type: 'p'}],
      [{type: 'p'}, {}, {type: 'p'}, {type: 'm'}, {}, {type: 'p'}],
    ]);
    expect(mountains).toEqual([
      {x: 1, y:0 },
      {x: 3, y:1 },
    ]);
  })
});

describe('getPlayers', () => {
  it('should generate a valid player array', () => {
    const player1 = {
      id: 0,
      name: 'paul',
      orientation: 'S',
      treasureCount: 0,
      moves: 'AAAADDGG',
      dones: '',
    };
    const player2 = {
      id: 1,
      name: 'alia',
      orientation: 'N',
      treasureCount: 0,
      moves: 'who care no control',
      dones: '',
    };
    let players = getPlayers([]);
    expect(players).toEqual([]);
    players = getPlayers([[{},{},{}], [{},{},{}]]);
    expect(players).toEqual([]);
    players = getPlayers([
      [{type: 'p'}, {type: 'm'}, {type: 'p', player: { x: 2, y: 0, ...player1 }}, {type: 'p'}, {type: 'm'}, {type: 'p'}],
      [{type: 'p', player: { x: 0, y: 1, ...player2 }}, {type: 'p'}, {type: 'p'}, {type: 'm'}, {type: 'm'}, {type: 'p'}],
    ]);
    expect(players).toEqual([
      { x: 2, y: 0, ...player1 },
      { x: 0, y: 1, ...player2 }
    ]);
    players = getPlayers([
      [{type: 'p'}, {type: 'm'}, {type: 'p', player: { x: 2, y: 0, ...player2 }}, {type: 'p'}, {type: 'm'}, {type: 'p'}],
      [{type: 'p', player: { x: 0, y: 1, ...player1 }}, {type: 'p'}, {type: 'p'}, {type: 'm'}, {type: 'm'}, {type: 'p'}],
    ]);
    expect(players).toEqual([
      { x: 2, y: 0, ...player2 },
      { x: 0, y: 1, ...player1 }
    ]);
  })
});

describe('playerCollide', () => {
  it('should correctly verify constraint that are restricting user mooves', () => {
    let map = {
      width: 0,
      height: 0,
      stage: []
    };
    let collide = playerCollide(map, 0, 0);
    expect(collide).toBe(true);
    collide = playerCollide(map, 100, -3590);
    expect(collide).toBe(true);
    collide = playerCollide(map, 321654987254361, -65498756456421);
    expect(collide).toBe(true);
    map = {
      width: 2,
      height: 1,
      stage: [[{type: 'm'}, {type: 'p', player: {} }]]
    };
    collide = playerCollide(map, 0, 0);
    expect(collide).toBe(true);
    map = {
      width: 2,
      height: 2,
      stage: [
        [
          {type: 'm'}, {type: 'p', player: {}},
        ],
        [
          {type: 'm'}, {type: 'p', player: {}},
        ]
      ]
    };
    collide = playerCollide(map, 1, 1);
    expect(collide).toBe(true);
    map = {
      width: 2,
      height: 1,
      stage: [[{type: 'p'}, {type: 'p', player: {} }]]
    };
    collide = playerCollide(map, 0, 0);
    expect(collide).toBe(false);
  })
});

describe('isFinished', () => {
  it('should correctly verify if users have mooves', () => {
    let players = [];
    let isFinish = false;
    let valuesFalse = [
      () => {},
      false,
      null,
      undefined,
      1,
      'le janbom c\'est bon, mais les carottes c\'est fantastique',
      'AAAADDGG' 
    ];
    valuesFalse.forEach(moveValue => {
      players = [
        { moves: '' },
        { moves: '' },
        { moves: '' },
        { moves: '' },
        { moves: moveValue },
        { moves: '' },
      ];
      isFinish = isFinished(players);
      expect(isFinish).toBe(false);
    });
    players = [];
    isFinish = isFinished(players);
    expect(isFinish).toBe(true);
    players = [{ moves: '' }];
    isFinish = isFinished(players);
    expect(isFinish).toBe(true);
  });
});

describe('runStep', () => {
  it('should correctly apply a move to the board and correctly update the returned board', () => {
    const board = {
      width: 0,
      height: 0,
      stage: [],
      treasures: [],
      mountains: [],
      players: [],
    };
    let resultBoard = runStep(board, 0);
    expect(resultBoard).toEqual(board);
    const board1 = {
      width: 2,
      height: 2,
      stage: [
        [
          { type: 'p', treasure: 2 },
          {
            type: 'p',
            player: {
              x: 1,
              y: 0,
              id: 0,
              name: 'alia',
              orientation: 'N',
              treasureCount: 0,
              moves: 'GAGAGAGAD',
              dones: '',
            }
          },
        ],
        [
          {
            type: 'p',
            player: {
              x: 0,
              y: 1,
              id: 1,
              name: 'paul',
              orientation: 'S',
              treasureCount: 4,
              moves: 'GAGAGAGAD',
              dones: '',
            }
          },
          { type: 'm' },
        ]
      ],
      treasures: [{
        x: 0,
        y: 0,
        nb: 2,
      }],
      mountains: [{
        x: 1,
        y: 1,
      }],
      players: [{
        x: 1,
        y: 0,
        id: 0,
        name: 'alia',
        orientation: 'N',
        treasureCount: 0,
        moves: 'GAGAGAGAD',
        dones: '',
      },
      {
        x: 0,
        y: 1,
        id: 1,
        name: 'paul',
        orientation: 'S',
        treasureCount: 4,
        moves: 'GAGAGAGAD',
        dones: '',
      }],
    };
    let expected = JSON.parse(JSON.stringify(board1));
    expected.players[0] = {
      x: 1,
      y: 0,
      id: 0,
      name: 'alia',
      orientation: 'O',
      treasureCount: 0,
      moves: 'AGAGAGAD',
      dones: 'G',
    };
    expected.stage[0][1].player.orientation = 'O';
    expected.stage[0][1].player.moves = 'AGAGAGAD';
    expected.stage[0][1].player.dones = 'G';
    const resultBoard1 = runStep(board1, 0);
    expect(resultBoard1).toStrictEqual(expected);
  });
});

describe('runStep', () => {
  it('should correctly apply a move to the board and correctly update the returned board', () => {
    const board = {
      width: 0,
      height: 0,
      stage: [],
      treasures: [],
      mountains: [],
      players: [],
    };
    let resultBoard = runStep(board, 0);
    expect(resultBoard).toEqual(board);
    const board1 = {
      width: 2,
      height: 2,
      stage: [
        [
          { type: 'p', treasure: 2 },
          {
            type: 'p',
            player: {
              x: 1,
              y: 0,
              id: 0,
              name: 'alia',
              orientation: 'N',
              treasureCount: 0,
              moves: 'GAGAGAGAD',
              dones: '',
            }
          },
        ],
        [
          {
            type: 'p',
            player: {
              x: 0,
              y: 1,
              id: 1,
              name: 'paul',
              orientation: 'S',
              treasureCount: 4,
              moves: 'GAGAGAGAD',
              dones: '',
            }
          },
          { type: 'm' },
        ]
      ],
      treasures: [{
        x: 0,
        y: 0,
        nb: 2,
      }],
      mountains: [{
        x: 1,
        y: 1,
      }],
      players: [{
        x: 1,
        y: 0,
        id: 0,
        name: 'alia',
        orientation: 'N',
        treasureCount: 0,
        moves: 'GAGAGAGAD',
        dones: '',
      },
      {
        x: 0,
        y: 1,
        id: 1,
        name: 'paul',
        orientation: 'S',
        treasureCount: 4,
        moves: 'GAGAGAGAD',
        dones: '',
      }],
    };
    let expected = JSON.parse(JSON.stringify(board1));
    expected.players[0] = {
      x: 1,
      y: 0,
      id: 0,
      name: 'alia',
      orientation: 'O',
      treasureCount: 0,
      moves: 'AGAGAGAD',
      dones: 'G',
    };
    expected.stage[0][1].player.orientation = 'O';
    expected.stage[0][1].player.moves = 'AGAGAGAD';
    expected.stage[0][1].player.dones = 'G';
    const resultBoard1 = runStep(board1, 0);
    expect(resultBoard1).toStrictEqual(expected);
  });
});

describe('solve', () => {
  it('should correctly apply all moves to the board and correctly update the returned board', () => {
    const board = {
      width: 2,
      height: 2,
      stage: [
        [
          { type: 'p', treasure: 2 },
          {
            type: 'p',
            player: {
              x: 1,
              y: 0,
              id: 0,
              name: 'alia',
              orientation: 'N',
              treasureCount: 0,
              moves: 'GAGAGAGAD',
              dones: '',
            }
          },
        ],
        [
          { type: 'p' },
          { type: 'm' },
        ]
      ],
      treasures: [{
        x: 0,
        y: 0,
        nb: 2,
      }],
      mountains: [{
        x: 1,
        y: 1,
      }],
      players: [{
        x: 1,
        y: 0,
        id: 0,
        name: 'alia',
        orientation: 'N',
        treasureCount: 0,
        moves: 'GAGAGAGAD',
        dones: '',
      }],
    };
    let expected = JSON.parse(JSON.stringify(board));
    expected.players[0] = {
      x: 0,
      y: 0,
      id: 0,
      name: 'alia',
      orientation: 'E',
      treasureCount: 2,
      moves: '',
      dones: 'GAGAGAGAD',
    };
    expected.stage[0][0].player = {
      x: 0,
      y: 0,
      id: 0,
      name: 'alia',
      orientation: 'E',
      treasureCount: 2,
      moves: '',
      dones: 'GAGAGAGAD',
    }
    expected.treasures = [];
    delete expected.stage[0][0].treasure;
    delete expected.stage[0][1].player;
    const resultBoard = solve(board);
    expect(resultBoard).toEqual(expected);
  });
});