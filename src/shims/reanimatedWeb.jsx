// بديل ويب بسيط لِ react-native-reanimated.
// لا يوفر أنيميشن حقيقي (spring/fade) بل تصرف "بدون حركة" آمن،
// يكفي لتشغيل الواجهة على الويب دون كسر الكود الذي يستخدم هذه الدوال.
import React from 'react';
import { View, Text } from 'react-native-web';

const Animated = {
  View: React.forwardRef((props, ref) => <View ref={ref} {...props} />),
  Text: React.forwardRef((props, ref) => <Text ref={ref} {...props} />),
};

export function useAnimatedStyle(styleFactory) {
  try {
    return typeof styleFactory === 'function' ? styleFactory() : {};
  } catch (e) {
    return {};
  }
}

export function withSpring(toValue) {
  return toValue;
}

export function withTiming(toValue) {
  return toValue;
}

export function useSharedValue(initial) {
  return { value: initial };
}

export const FadeIn = {};
export const FadeOut = {};
export const Easing = {
  linear: (t) => t,
  ease: (t) => t,
};

export default Animated;