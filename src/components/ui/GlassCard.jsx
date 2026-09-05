import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, radius } from '../../theme';

const TONES = {
  dark: { tint: 'dark', intensity: 65, borderColor: colors.glassBorder, blur: true },
  darkStrong: {
    tint: 'dark',
    intensity: 80,
    borderColor: colors.glassBorderStrong,
    blur: true,
  },
  light: { tint: 'light', intensity: 45, borderColor: colors.glassBorder, blur: true },
  auth: {
    blur: false,
    background: '#FFFCFA',
    borderColor: '#E8DFD4',
  },
  feed: {
    blur: false,
    background: '#1C1612',
    borderColor: 'rgba(255,255,255,0.08)',
  },
};

export default function GlassCard({
  children,
  tone = 'dark',
  intensity,
  radius: cardRadius = radius.xl,
  style,
  ...rest
}) {
  const preset = TONES[tone] || TONES.dark;
  const shape = [
    styles.base,
    { borderRadius: cardRadius, borderColor: preset.borderColor },
    !preset.blur && { backgroundColor: preset.background },
    style,
  ];

  if (!preset.blur) {
    return (
      <View style={shape} {...rest}>
        {children}
      </View>
    );
  }

  return (
    <BlurView
      tint={preset.tint}
      intensity={intensity ?? preset.intensity}
      style={shape}
      {...rest}
    >
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
    borderWidth: 1.5,
  },
});