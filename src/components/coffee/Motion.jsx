import React from 'react';
import { TouchableOpacity } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const spring = {
  damping: 19,
  stiffness: 360,
  mass: 0.42,
  overshootClamping: false,
  reduceMotion: ReduceMotion.System,
};

export function FadeInView({ children, delay = 0, distance = 12, style, ...props }) {
  const entering = FadeInDown
    .delay(delay)
    .springify()
    .damping(20)
    .stiffness(190)
    .mass(0.62)
    .reduceMotion(ReduceMotion.System)
    .withInitialValues({ opacity: 0, transform: [{ translateY: distance }, { scale: 0.988 }] });

  return <Animated.View {...props} entering={entering} style={style}>{children}</Animated.View>;
}

export function PressableScale({ children, style, disabled, onPressIn, onPressOut, ...props }) {
  const pressed = useSharedValue(0);
  const motionStyle = useAnimatedStyle(() => ({
    opacity: 1 - pressed.value * 0.08,
    transform: [{ scale: 1 - pressed.value * 0.045 }],
  }), []);

  return <AnimatedTouchable
    {...props}
    disabled={disabled}
    activeOpacity={1}
    onPressIn={(event) => {
      if (!disabled) pressed.value = withSpring(1, spring);
      onPressIn?.(event);
    }}
    onPressOut={(event) => {
      pressed.value = withSpring(0, spring);
      onPressOut?.(event);
    }}
    style={[style, motionStyle]}
  >{children}</AnimatedTouchable>;
}

export function ScreenTransition({ children, screenKey, style }) {
  const entering = FadeIn
    .duration(230)
    .easing(Easing.out(Easing.cubic))
    .reduceMotion(ReduceMotion.System);
  return <Animated.View key={screenKey} entering={entering} style={[{ flex: 1 }, style]}>{children}</Animated.View>;
}
