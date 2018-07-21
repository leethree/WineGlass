import React from 'react';
import { StyleSheet, View } from 'react-native';

import Demo from './src/Demo';

const App = () => (
  <View style={styles.container}>
    <Demo />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
