import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Demo from './src/Demo';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Demo />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
