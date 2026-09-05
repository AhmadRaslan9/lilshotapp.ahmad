import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';

export default function TabBar({ activeTab, onChangeTab, onOpenCamera }) {
  const insets = useSafeAreaInsets();
  const Item = ({ id, icon, label }) => {
    const on = activeTab === id;
    return (
      <TouchableOpacity
        style={[styles.item, on && styles.itemOn]}
        onPress={() => onChangeTab(id)}
        accessibilityRole="tab"
        accessibilityLabel={label}
        accessibilityState={{ selected: on }}
        activeOpacity={0.8}
      >
        <Ionicons
          name={icon}
          size={22}
          color={on ? colors.textOnDark : colors.textOnDarkFaint}
        />
        <Text numberOfLines={1} style={[styles.label, !on && styles.labelMuted]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.wrap, { bottom: Math.max(insets.bottom, 12) }]} pointerEvents="box-none">
      <BlurView intensity={50} tint="dark" style={styles.bar}>
        <Item id="home" icon="home" label="Feed" />
        <Item id="shop" icon="compass-outline" label="Explore" />

        <View style={styles.cameraSlot}>
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={onOpenCamera}
            accessibilityRole="button"
            accessibilityLabel="Open camera"
            accessibilityHint="Capture a coffee moment"
            activeOpacity={0.85}
          >
            <View style={styles.cameraInner}>
              <Ionicons name="camera" size={30} color={colors.cta} />
            </View>
          </TouchableOpacity>
          <Text style={styles.cameraLabel}>Shot</Text>
        </View>

        <Item id="favorites" icon="heart-outline" label="Saved" />
        <Item id="profile" icon="person" label="Profile" />
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 12,
    right: 12,
    alignItems: 'center',
  },
  bar: {
    width: '100%',
    maxWidth: 420,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 8,
    borderRadius: 36,
    overflow: 'hidden',
    backgroundColor: 'rgba(26, 20, 15, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  item: {
    flex: 1,
    minWidth: 0,
    minHeight: 52,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  itemOn: { backgroundColor: 'rgba(255,255,255,0.14)' },
  label: { color: colors.textOnDark, fontWeight: '600', fontSize: 10 },
  labelMuted: { color: colors.textOnDarkMuted },
  cameraSlot: { width: 76, alignItems: 'center', gap: 3 },
  cameraLabel: { color: colors.primaryLight, fontWeight: '800', fontSize: 11 },
  cameraButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    padding: 4,
    backgroundColor: colors.primaryLight,
    borderWidth: 2,
    borderColor: colors.textOnDark,
  },
  cameraInner: {
    flex: 1,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(26,20,16,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
