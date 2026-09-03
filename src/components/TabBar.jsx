// src/components/TabBar.js
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { colors, radius } from '../theme';

const logoImg = require('../../assets/coffeecup.png');

export const TABS = [
  { id: 'home', icon: 'home', lib: Ionicons, outline: 'home-outline' },
  { id: 'favorites', icon: 'heart', lib: Ionicons, outline: 'heart-outline' },
  { id: 'shop', icon: 'shopping-bag', lib: Feather, outline: 'shopping-bag' },
  { id: 'profile', icon: 'person', lib: Ionicons, outline: 'person-outline' },
];

export default function TabBar({ activeTab, onChangeTab }) {
  const activeIndex = TABS.findIndex((t) => t.id === activeTab);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withSpring(activeIndex * 48, { damping: 18, stiffness: 140, mass: 0.8 }),
      },
    ],
  }));

  return (
    <View style={styles.container}>
      <BlurView intensity={70} tint="dark" style={styles.pill}>
        <Animated.View style={[styles.indicator, indicatorStyle]} />

        {TABS.map((tab) => {
          const IconComponent = tab.lib;
          const isActive = activeTab === tab.id;

          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabButton}
              onPress={() => onChangeTab(tab.id)}
              activeOpacity={0.7}
            >
              <IconComponent
                name={isActive ? tab.icon : tab.outline}
                size={21}
                color={isActive ? colors.textOnDark : colors.textOnDarkFaint}
              />
            </TouchableOpacity>
          );
        })}
      </BlurView>

      <TouchableOpacity onPress={() => onChangeTab('shop')} activeOpacity={0.8}>
        <BlurView intensity={80} tint="light" style={styles.shopButton}>
          <Image source={logoImg} style={styles.shopIcon} contentFit="contain" />
        </BlurView>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    borderRadius: radius.pill,
    padding: 6,
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glassDark,
  },
  tabButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  indicator: {
    position: 'absolute',
    left: 6,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderWidth: 1,
    borderColor: colors.glassBorderStrong,
    zIndex: 1,
  },
  shopButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  shopIcon: { width: 28, height: 28 },
});
