import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';

import { imageAssets } from './src/assets';
import Demo from './src/Demo';

const loadAssets = async () =>
  Promise.all(
    imageAssets.map(image => Asset.fromModule(image).downloadAsync()),
  );

class App extends React.Component {
  state = {
    isReady: false,
  };

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={loadAssets}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn} // eslint-disable-line no-console
        />
      );
    }

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

export default App;
