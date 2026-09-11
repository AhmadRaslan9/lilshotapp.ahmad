import React, { useEffect, useRef } from 'react';
import { Animated, Easing, TouchableOpacity } from 'react-native';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function FadeInView({ children, delay = 0, distance = 12, style, ...props }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 420,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [delay, progress]);

  return <Animated.View
    {...props}
    style={[
      style,
      {
        opacity: progress,
        transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [distance, 0] }) }],
      },
    ]}
  >{children}</Animated.View>;
}

export function PressableScale({ children, style, disabled, onPressIn, onPressOut, ...props }) {
  const scale = useRef(new Animated.Value(1)).current;
  const spring = (toValue) => Animated.spring(scale, {
    toValue,
    speed: 28,
    bounciness: 5,
    useNativeDriver: true,
  }).start();

  return <AnimatedTouchable
    {...props}
    disabled={disabled}
    activeOpacity={1}
    onPressIn={(event) => { if (!disabled) spring(0.965); onPressIn?.(event); }}
    onPressOut={(event) => { spring(1); onPressOut?.(event); }}
    style={[style, { transform: [{ scale }] }]}
  >{children}</AnimatedTouchable>;
}

export function ScreenTransition({ children, screenKey, style }) {
  return <FadeInView key={screenKey} distance={8} style={[{ flex: 1 }, style]}>{children}</FadeInView>;
}
