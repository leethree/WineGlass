/* @flow */

export type Point2D = {
  x: number,
  y: number,
};

export type Point3D = {
  x: number,
  y: number,
  z: number,
};

export const polar2ortho = (r: number, rad: number) => ({
  x: r * Math.cos(rad),
  y: r * Math.sin(rad),
});

export const ortho2polar = (x: number, y: number) => ({
  r: Math.sqrt(x ** 2 + y ** 2),
  rad: Math.atan2(y, x),
});

export const distance2D = (first: Point2D, second: Point2D) =>
  Math.sqrt((first.x - second.x) ** 2 + (first.y - second.y) ** 2);

export const rotate = (x: number, y: number, deltaRad: number) => {
  const { r, rad } = ortho2polar(x, y);
  return polar2ortho(r, rad + deltaRad);
};

export const clamp = (x: number, min: number, max: number) =>
  Math.min(Math.max(x, min), max);

export const intervalIntersection = (
  left: number,
  right: number,
  clampLeft: number,
  clampRight: number,
) => {
  const intersection =
    clamp(right, clampLeft, clampRight) - clamp(left, clampLeft, clampRight);
  return intersection / (right - left);
};
