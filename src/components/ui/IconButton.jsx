// src/components/ui/IconButton.js
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, radius } from '../../theme';

export default function IconButton({
  children,
  onPress,
  size = 42,
  variant = 'flat', // 'flat' | 'glass'
  style,
  ...rest
}) {
  const dimension = { width: size, height: size, borderRadius: size / 2 };

  if (variant === 'glass') {
    return (
      <TouchableOpacity onPress={onPress} style={[styles.wrapper, dimension, style]} {...rest}>
        <BlurView intensity={55} tint="light" style={[styles.blur, dimension]}>
          {children}
        </BlurView>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.flat, dimension, style]}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: { overflow: 'hidden' },
  blur: { alignItems: 'center', justifyContent: 'center' },
  flat: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
});
