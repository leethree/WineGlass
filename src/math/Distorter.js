/* @flow */
/* eslint-disable no-mixed-operators */

import Easing from 'easing-js';

import { ortho2polar, polar2ortho, type Point3D } from './utils';

const absMinus = (x: number, delta: number) => {
  if (x > delta) {
    return x - delta;
  }
  if (x < -delta) {
    return x + delta;
  }
  return 0;
};

const Distorter = (
  sphereR: number,
  screenW: number,
  screenH: number,
  scaleR: number,
) => {
  const zoom = (input: Point3D): Point3D => ({
    x: input.x * scaleR,
    y: input.y * scaleR,
    z: input.z * scaleR,
  });

  const fisheye = (input: Point3D): Point3D => {
    const polar = ortho2polar(input.x, input.y);

    // distort radius 1.5x~1.0x
    const r = polar.r * Easing.easeOutSine(polar.r / sphereR, 1.5, -0.5, 1);
    // distort scale 1.5x~1.0x
    const scale = Easing.easeOutCubic(polar.r / sphereR, 1.5, -0.5, 1);

    const { x, y } = polar2ortho(r, polar.rad);

    return { x, y, z: input.z * scale };
  };

  const edgeZoom = (input: Point3D): Point3D => {
    const distanceX = screenW / 2 - Math.abs(input.x);
    const distanceY = screenH / 2 - Math.abs(input.y);
    const distance = Math.min(distanceX, distanceY);

    const buffer = input.z;
    const edge = -buffer / 4;

    // scale size
    let scale = 1;
    if (distance < edge) {
      scale = 0;
    } else if (distance - edge < buffer) {
      scale = Easing.easeInOutSine(distance - edge, 0, 1, buffer);
    }

    // offset X
    let x = input.x;
    if (distanceX < edge + buffer) {
      const delta = Easing.easeInSine(
        distanceX - edge - buffer,
        0,
        buffer / 3,
        edge + buffer,
      );
      x = absMinus(x, delta);
    }

    // offset Y
    let y = input.y;
    if (distanceY < edge + buffer) {
      const delta = Easing.easeInSine(
        distanceY - edge - buffer,
        0,
        buffer / 3,
        edge + buffer,
      );
      y = absMinus(y, delta);
    }

    return { x, y, z: input.z * scale };
  };

  return (input: Point3D) => zoom(edgeZoom(fisheye(input)));
};

export default Distorter;
