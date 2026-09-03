// src/navigation/MainTabs.js
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { StyleSheet } from 'react-native';
import TabBar from '../components/TabBar';
import HomeScreen from '../screens/HomeScreen';
import ShopScreen from '../screens/ShopScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors } from '../theme';

const SCREENS = {
  home: HomeScreen,
  shop: ShopScreen,
  favorites: FavoritesScreen,
  profile: ProfileScreen,
};

export default function MainTabs() {
  const [activeTab, setActiveTab] = useState('home');
  const ActiveScreen = SCREENS[activeTab] || HomeScreen;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Animated.View key={activeTab} entering={FadeIn.duration(200)} exiting={FadeOut.duration(120)} style={styles.flex}>
        <ActiveScreen />
      </Animated.View>

      <TabBar activeTab={activeTab} onChangeTab={setActiveTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
});
