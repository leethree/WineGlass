/* @flow */
/* Reference: http://www.redblobgames.com/grids/hexagons/ */
/* eslint-disable no-mixed-operators */

import { rotate } from './utils';

type Hex = {
  q: number,
  r: number,
  s: number,
};

const Cube = (q: number, r: number, s: number): Hex => ({ q, r, s });

const CUBE_DIRECTIONS = [
  Cube(1, 0, -1),
  Cube(1, -1, 0),
  Cube(0, -1, 1),
  Cube(-1, 0, 1),
  Cube(-1, 1, 0),
  Cube(0, 1, -1),
];

type Direction = 0 | 1 | 2 | 3 | 4 | 5;
Cube.direction = (direction: Direction) => CUBE_DIRECTIONS[direction];
Cube.scale = (a: Hex, k: number) => Cube(a.q * k, a.r * k, a.s * k);
Cube.add = (a: Hex, b: Hex) => Cube(a.q + b.q, a.r + b.r, a.s + b.s);
Cube.neighbor = (hex: Hex, direction: Direction) =>
  Cube.add(hex, Cube.direction(direction));

function* cubeRing(center: Hex, radius: number) {
  let cube = Cube.add(center, Cube.scale(Cube.direction(4), radius));
  for (let i = 0; i < 6; i += 1) {
    for (let j = 0; j < radius; j += 1) {
      yield cube;
      cube = Cube.neighbor(cube, i);
    }
  }
}

function* cubeSpiral(center: Hex = Cube(0, 0, 0)) {
  yield center;
  let k = 0;
  for (;;) {
    k += 1;
    yield* cubeRing(center, k);
  }
}

const HexGrid = (size: number) => {
  const hexToPixel = (hex: Hex) => ({
    x: size * Math.sqrt(3) * (hex.q + hex.r / 2),
    y: size * (3 / 2) * hex.r,
  });

  return {
    coords: (length: number) => {
      const spiral = cubeSpiral();
      const hexPoints = [];
      for (let i = 0; i < length; i += 1) {
        const point = spiral.next().value;
        if (point) {
          const pixel = hexToPixel(point);
          hexPoints.push(rotate(pixel.x, pixel.y, 5));
        }
      }
      return hexPoints;
    },
  };
};

export default HexGrid;
