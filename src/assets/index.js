/* @flow */

/* eslint-disable global-require, import/no-commonjs, import/no-unresolved */

export const imageAssets = [
  require('./product1.png'),
  require('./product2.png'),
  require('./product3.png'),
  require('./product4.png'),
  require('./product5.png'),
  require('./product6.png'),
  require('./product7.png'),
  require('./product8.png'),
  require('./product9.png'),
  require('./product10.png'),
  require('./product11.png'),
  require('./product12.png'),
  require('./product13.png'),
  require('./product14.png'),
  require('./product15.png'),
  require('./product16.png'),
  require('./product17.png'),
  require('./product18.png'),
  require('./product19.png'),
];

function* imageGen() {
  for (;;) {
    yield* imageAssets;
  }
}

const gen = imageGen();

export const getImage = () => gen.next().value;
