module.exports.generate = function(options) {
    const {
      width,
      height,
  
      empty: EMPTY = 0,
      wall: WALL = 1,
    } = options;
  
    const OOB = {};
  
    if (!width || !height) {
      throw new Error('Missing required `width` & `height` options!');
    }
  
    const out = new Array(height);
    for (let y = 0; y < out.length; y++) {
      out[y] = new Array(width).fill(WALL);
    }
  
    function lookup(field, x, y, defaultValue = EMPTY) {
      if (x < 0 || y < 0 || x >= width || y >= height) {
        return defaultValue;
      }
      return field[y][x];
    }
  
    const walls = [];
    function makePassage(x, y) {
      out[y][x] = EMPTY;
  
      const candidates = [
        { x: x - 1, y },
        { x: x + 1, y },
        { x, y: y - 1 },
        { x, y: y + 1 },
      ];
      for (const wall of candidates) {
        if (lookup(out, wall.x, wall.y) === WALL) {
          walls.push(wall);
        }
      }
    }
  
    // Pick random point and make it a passage
    makePassage(Math.random() * width | 0, Math.random() * height | 0);
  
    while (walls.length !== 0) {
      const { x, y } = walls.splice((Math.random() * walls.length) | 0, 1)[0];
  
      const left = lookup(out, x - 1, y, OOB);
      const right = lookup(out, x + 1, y, OOB);
      const top = lookup(out, x, y - 1, OOB);
      const bottom = lookup(out, x, y + 1, OOB);
  
      if (left === EMPTY && right === WALL) {
        out[y][x] = EMPTY;
        makePassage(x + 1, y);
      } else if (right === EMPTY && left === WALL) {
        out[y][x] = EMPTY;
        makePassage(x - 1, y);
      } else if (top === EMPTY && bottom === WALL) {
        out[y][x] = EMPTY;
        makePassage(x, y + 1);
      } else if (bottom === EMPTY && top === WALL) {
        out[y][x] = EMPTY;
        makePassage(x, y - 1);
      }
    }
  
    return out;
  };