import {
  getRandomInt,
  Counter,
  genCell,
  genPlayer,
  genRow,
  genStage,
  getTreasures
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
    expect(board.stage.length).toBeGreaterThan(1);
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