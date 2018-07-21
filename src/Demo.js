/* @flow */

import React from 'react';
import { Image, StyleSheet, Dimensions } from 'react-native';

import { getImage } from './assets';
import WineGlass from './components/WineGlass';

const BUBBLE_SIZE = Dimensions.get('window').width * 0.28;
const NUM_OF_BUBBLES = 19;
// generate images
const images = [...Array(NUM_OF_BUBBLES).keys()].map(getImage);

const Demo = () => {
  const renderItem = ({ item, index }: *) => (
    <Image style={styles.image} source={item} resizeMode="cover" />
  );

  return (
    <WineGlass
      data={images}
      renderItem={renderItem}
      bubbleDistance={BUBBLE_SIZE * 1.2}
      bubbleSize={BUBBLE_SIZE}
      sphereRadius={BUBBLE_SIZE * 5}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    ...StyleSheet.absoluteFillObject,
    height: undefined,
    width: undefined,
  },
});

export default Demo;
