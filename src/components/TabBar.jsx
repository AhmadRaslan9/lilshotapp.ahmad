import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { colors } from '../theme';

export default function TabBar({ activeTab, onChangeTab, onCompose }) {
  const Item = ({ id, icon, label }) => {
    const on = activeTab === id;
    return (
      <TouchableOpacity
        style={[styles.item, on && styles.itemOn]}
        onPress={() => onChangeTab(id)}
        activeOpacity={0.8}
      >
        <Ionicons
          name={icon}
          size={22}
          color={on ? colors.textOnDark : colors.textOnDarkFaint}
        />
        {on && label ? <Text style={styles.label}>{label}</Text> : null}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <BlurView intensity={50} tint="dark" style={styles.bar}>
        <Item id="home" icon="home" label="Feed" />
        <Item id="chats" icon="chatbubbles" label="Chats" />

        <TouchableOpacity
          style={styles.plus}
          onPress={onCompose || (() => onChangeTab('shop'))}
          activeOpacity={0.85}
        >
          <Feather name="plus" size={22} color="#FFF8F2" />
        </TouchableOpacity>

        <Item id="profile" icon="person" label="Profile" />
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 22,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 6,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: 'rgba(26, 20, 15, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  item: {
    minWidth: 48,
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  itemOn: { backgroundColor: 'rgba(255,255,255,0.14)' },
  label: { color: '#FFF8F2', fontWeight: '700', fontSize: 13 },
  plus: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
});