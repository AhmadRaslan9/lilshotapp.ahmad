// src/hooks/useEntranceAnimation.js
import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

/** يشغّل انميشن ظهور (تلاشي + انزلاق للأعلى) كلما تغيّر `trigger`. */
export function useEntranceAnimation(trigger) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(35)).current;

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(35);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.poly(3)),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();
  }, [trigger]);

  return { opacity, translateY };
}
