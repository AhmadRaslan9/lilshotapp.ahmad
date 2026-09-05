import React, { useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  ActivityIndicator,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, radius, typography } from '../../theme';

const VARIANTS = {
  solid: {
    background: colors.primary,
    borderColor: colors.primary,
    textColor: colors.textOnDark,
    blur: false,
    pill: false,
  },
  glass: {
    background: 'rgba(255,255,255,0.22)',
    borderColor: colors.glassBorderStrong,
    textColor: colors.textOnDark,
    blur: true,
    pill: false,
  },
  outline: {
    background: 'rgba(0,0,0,0.18)',
    borderColor: colors.glassBorder,
    textColor: colors.textOnDark,
    blur: true,
    pill: false,
  },
  // شكل mockup التسجيل — حبة دواء إسبريسو
  cta: {
    background: '#1A1410',
    borderColor: '#1A1410',
    textColor: '#F6F1EA',
    blur: false,
    pill: true,
  },
  // زر Follow بالبروفايل
  follow: {
    background: '#FFF8F2',
    borderColor: '#FFF8F2',
    textColor: '#1A1410',
    blur: false,
    pill: true,
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
  const round = preset.pill ? 999 : radius.xl;

  const pressIn = () =>
    Animated.spring(scale, {
      toValue: 0.96,
      friction: 6,
      tension: 260,
      useNativeDriver: true,
    }).start();
  const pressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      tension: 200,
      useNativeDriver: true,
    }).start();

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
          { borderRadius: round, transform: [{ scale }], opacity: disabled ? 0.5 : 1 },
          style,
        ]}
      >
        {preset.blur ? (
          <BlurView
            tint="light"
            intensity={40}
            style={[
              styles.fill,
              {
                borderRadius: round,
                backgroundColor: preset.background,
                borderColor: preset.borderColor,
                minHeight: preset.pill ? 56 : undefined,
              },
            ]}
          >
            {content}
          </BlurView>
        ) : (
          <View
            style={[
              styles.fill,
              {
                borderRadius: round,
                backgroundColor: preset.background,
                borderColor: preset.borderColor,
                minHeight: preset.pill ? 56 : undefined,
              },
            ]}
          >
            {content}
          </View>
        )}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  button: { overflow: 'hidden' },
  fill: {
    paddingVertical: 16,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  content: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  text: { ...typography.title },
});