// src/components/ui/GlassCard.js
//
// يوحّد كل بطاقات "الزجاج السائل" (BlurView) التي كانت مكررة بشكل شبه
// متطابق في ProfileScreen / ShopScreen / AssetExample. بدلاً من نسخ
// نفس الخصائص كل مرة، نمرر فقط tone (dark/light) و intensity عند
// الحاجة لاستثناء.

import React from 'react';
import { StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, radius } from '../../theme';

const TONES = {
  dark: { tint: 'dark', intensity: 65, borderColor: colors.glassBorder },
  darkStrong: { tint: 'dark', intensity: 80, borderColor: colors.glassBorderStrong },
  light: { tint: 'light', intensity: 45, borderColor: colors.glassBorder },
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

  return (
    <BlurView
      tint={preset.tint}
      intensity={intensity ?? preset.intensity}
      style={[
        styles.base,
        { borderRadius: cardRadius, borderColor: preset.borderColor },
        style,
      ]}
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
