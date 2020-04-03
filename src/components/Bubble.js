/* @flow */

import * as React from 'react';
import { Animated, View, Easing as RNEasing, StyleSheet } from 'react-native';
import Easing from 'easing-js';

import { distance2D, type Point3D } from '../math/utils';

type Props = {
  children: React.Node,
  initialPosition: Point3D,
  onPress: ?() => any,
};

type State = {
  visible: boolean,
};

const NATURAL_SIZE = 200;
const OPACITY_RADIUS_MIN = 40;

const createStyleFromPosition = (
  position: Point3D,
  baseOpacity: number = 1,
) => {
  const { x, y, z } = position;
  const radius = z / 2;
  let opacity = baseOpacity;
  if (radius < OPACITY_RADIUS_MIN) {
    opacity = Math.max(
      0,
      Easing.easeOutQuad(radius, -0.5, baseOpacity + 0.5, OPACITY_RADIUS_MIN),
    );
  }
  return {
    opacity,
    transform: [
      { translateX: x - NATURAL_SIZE / 2 },
      { translateY: y - NATURAL_SIZE / 2 },
      { scale: z / NATURAL_SIZE },
    ],
  };
};

class Bubble extends React.Component<Props, State> {
  props: Props;

  state: State = {
    visible: true,
  };

  element: *;

  opacity: number = 1;

  highlightOpacity: number = 1;

  highlighted: boolean = false;

  position: Point3D;

  highlightOpacityAnim: Animated.Value = new Animated.Value(1);

  constructor(props: Props) {
    super(props);
    this.position = props.initialPosition;
  }

  componentDidMount() {
    this.highlightOpacityAnim.addListener(({ value }) => {
      this.highlightOpacity = value;
      this.updateNative();
    });
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return nextState.visible !== this.state.visible;
  }

  componentWillUnmount() {
    this.highlightOpacityAnim.removeAllListeners();
  }

  setPosition(position: Point3D, opacity: number = 1) {
    this.position = position;
    this.opacity = opacity;
    // do not render if size <= 0
    if (position.z <= 0 || opacity <= 0) {
      if (this.state.visible) {
        this.setState({
          visible: false,
        });
      }
    } else {
      if (!this.state.visible) {
        this.setState({
          visible: true,
        });
      }
      this.updateNative();
    }
  }

  setNativeProps(nativeProps: Object) {
    // forward setNativeProps to element
    if (this.element && typeof this.element.setNativeProps === 'function') {
      this.element.setNativeProps(nativeProps);
    }
  }

  setHighlightOpacityTo = (value: number, duration: number = 250) => {
    if (duration > 0) {
      this.highlightOpacityAnim.stopAnimation(() => {
        Animated.timing(this.highlightOpacityAnim, {
          toValue: value,
          duration,
          easing: RNEasing.inOut(RNEasing.quad),
        }).start();
      });
    } else {
      this.highlightOpacityAnim.setValue(value);
    }
  };

  updateNative = () => {
    this.setNativeProps({
      style: createStyleFromPosition(
        this.position,
        this.opacity * this.highlightOpacity,
      ),
    });
  };

  isTouchWithinHitCircle = (x: number, y: number) => {
    const distance = distance2D(
      { x, y },
      {
        x: NATURAL_SIZE / 2,
        y: NATURAL_SIZE / 2,
      },
    );
    return distance < NATURAL_SIZE / 2;
  };

  onPress = () => {
    if (this.props.onPress) {
      this.props.onPress();
    }
  };

  startHighlight = () => {
    if (!this.highlighted) {
      this.highlighted = true;
      this.setHighlightOpacityTo(0.5);
      return true;
    }
    return false;
  };

  endHighlight = () => {
    if (this.highlighted) {
      this.highlighted = false;
      this.setHighlightOpacityTo(1);
      return true;
    }
    return false;
  };

  handleStartShouldSetResponder = ({ nativeEvent }: *) =>
    this.isTouchWithinHitCircle(nativeEvent.locationX, nativeEvent.locationY);

  handleResponderGrant = () => {
    this.startHighlight();
  };

  handleResponderMove = ({ nativeEvent }: *) => {
    const hit = this.isTouchWithinHitCircle(
      nativeEvent.locationX,
      nativeEvent.locationY,
    );
    if (!hit) {
      this.endHighlight();
    }
  };

  handleResponderRelease = () => {
    if (this.endHighlight()) {
      this.onPress();
    }
  };

  handleResponderTerminate = () => {
    this.endHighlight();
  };

  render() {
    if (!this.state.visible) {
      return null;
    }
    const { children, initialPosition, onPress, ...rest } = this.props;

    const positionStyle = createStyleFromPosition(
      this.position,
      this.opacity * this.highlightOpacity,
    );
    const styleList = [styles.circle, positionStyle];

    return (
      <View
        {...rest}
        style={styleList}
        ref={el => {
          this.element = el;
        }}
        onStartShouldSetResponder={this.handleStartShouldSetResponder}
        onResponderGrant={this.handleResponderGrant}
        onResponderMove={this.handleResponderMove}
        onResponderRelease={this.handleResponderRelease}
        onResponderTerminate={this.handleResponderTerminate}
      >
        {children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  circle: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: NATURAL_SIZE,
    height: NATURAL_SIZE,
    borderRadius: NATURAL_SIZE / 2,
    overflow: 'hidden',
  },
});

export default Bubble;
