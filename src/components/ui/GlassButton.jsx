// src/components/ui/GlassButton.js
//
// زر موحّد بديل عن ModernAnimatedButton (كانت مكررة داخل AssetExample
// فقط ولا يمكن إعادة استخدامها في بقية الشاشات). يدعم 3 أنماط:
// 'solid' (برتقالي معبأ)، 'glass' (زجاجي فاتح)، 'outline' (زجاجي شفاف
// بحدود فقط) — وهي نفس الأنماط البصرية الثلاثة التي كانت موجودة يدوياً
// في شاشة الدخول القديمة.

import React, { useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableWithoutFeedback, ActivityIndicator, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, radius, typography } from '../../theme';

const VARIANTS = {
  solid: {
    background: colors.primary,
    borderColor: colors.primary,
    textColor: colors.textOnDark,
    blur: false,
  },
  glass: {
    background: 'rgba(255,255,255,0.22)',
    borderColor: colors.glassBorderStrong,
    textColor: colors.textOnDark,
    blur: true,
  },
  outline: {
    background: 'rgba(0,0,0,0.18)',
    borderColor: colors.glassBorder,
    textColor: colors.textOnDark,
    blur: true,
  },
};

export default function GlassButton({
  title,
  onPress,
  variant = 'glass',
  loading = false,
  disabled = false,
  style,
  icon,
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const preset = VARIANTS[variant] || VARIANTS.glass;

  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.96, friction: 6, tension: 260, useNativeDriver: true }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, friction: 5, tension: 200, useNativeDriver: true }).start();

  const content = (
    <View style={styles.content}>
      {loading ? (
        <ActivityIndicator color={preset.textColor} />
      ) : (
        <>
          {icon}
          <Text style={[styles.text, { color: preset.textColor }]}>{title}</Text>
        </>
      )}
    </View>
  );

  return (
    <TouchableWithoutFeedback
      onPressIn={pressIn}
      onPressOut={pressOut}
      onPress={disabled || loading ? undefined : onPress}
    >
      <Animated.View
        style={[
          styles.button,
          { transform: [{ scale }], opacity: disabled ? 0.5 : 1 },
          style,
        ]}
      >
        {preset.blur ? (
          <BlurView
            tint="light"
            intensity={40}
            style={[styles.blurFill, { backgroundColor: preset.background, borderColor: preset.borderColor }]}
          >
            {content}
          </BlurView>
        ) : (
          <View style={[styles.blurFill, { backgroundColor: preset.background, borderColor: preset.borderColor }]}>
            {content}
          </View>
        )}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  blurFill: {
    borderRadius: radius.xl,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    ...typography.title,
  },
});
