/* @flow */

import * as React from 'react';
import { Animated, PanResponder, View, Platform } from 'react-native';

import { distance2D } from '../math/utils';

type Props = {
  style: *,
  onLayout?: ?(event: *) => void,
  onPan?: ?(number, number, boolean) => void,
  onPress?: ?() => any,
  findSnapPoint?: ?(number, number) => { x: number, y: number },
  children: ?React.Node,
};

class PanView extends React.Component<Props, void> {
  props: Props;

  panResponder: PanResponder;

  currentX: number = 0;

  currentY: number = 0;

  pan: Animated.ValueXY = new Animated.ValueXY();

  dragging: boolean = false;

  static defaultProps = {
    onLayout: null,
    onPan: null,
    onPress: null,
    findSnapPoint: null,
  };

  componentWillMount() {
    this.pan.addListener(value => {
      // workaround for X Y not updating simutaniously on Android
      if (
        Platform.OS === 'android' &&
        (value.x === this.currentX || value.y === this.currentY) &&
        distance2D(value, { x: this.currentX, y: this.currentY }) < 100
      ) {
        return;
      }
      this.currentX = value.x;
      this.currentY = value.y;

      if (this.props.onPan) {
        this.props.onPan(value.x, value.y, this.dragging);
      }
    });

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => {
        if (this.props.onPress) {
          this.props.onPress();
        }
        return false;
      },
      onMoveShouldSetPanResponder: (e: Object, gestureState: Object) =>
        Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10,
      onPanResponderGrant: () => {
        this.pan.stopAnimation();
        this.pan.extractOffset();
        this.dragging = true;
      },
      onPanResponderMove: Animated.event([
        null,
        {
          dx: this.pan.x,
          dy: this.pan.y,
        },
      ]),
      onPanResponderRelease: (e: Object, gestureState: Object) => {
        this.pan.flattenOffset();
        this.handlePanResponderRelease(gestureState);
        this.dragging = false;
      },
    });
  }

  componentWillUnmount() {
    this.pan.removeAllListeners();
  }

  setPan(x: number, y: number, animate: boolean = true) {
    this.pan.stopAnimation();
    this.pan.flattenOffset();
    if (animate) {
      Animated.spring(this.pan, {
        toValue: { x: -x, y: -y },
        friction: 10,
        tension: 40,
      }).start();
    } else {
      this.pan.setValue({ x: -x, y: -y });
    }
  }

  handlePanResponderRelease(gestureState: Object) {
    const inertia = 150;
    const vx = Math.max(Math.min(gestureState.vx, 6), -6);
    const vy = Math.max(Math.min(gestureState.vy, 6), -6);

    if (this.props.findSnapPoint) {
      const snap = this.props.findSnapPoint(
        -this.currentX + -vx * inertia,
        -this.currentY + -vy * inertia,
      );
      Animated.spring(this.pan, {
        velocity: { x: vx, y: vy },
        toValue: { x: -snap.x, y: -snap.y },
        friction: 10,
        tension: 40,
      }).start();
    } else {
      Animated.decay(this.pan, {
        velocity: { x: vx, y: vy },
      }).start();
    }
  }

  onLayout = (event: *) => this.props.onLayout && this.props.onLayout(event);

  render() {
    return (
      <View
        style={this.props.style}
        onLayout={this.onLayout}
        {...this.panResponder.panHandlers}
      >
        {this.props.children}
      </View>
    );
  }
}

export default PanView;
