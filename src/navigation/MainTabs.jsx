import React, { useState } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TabBar from '../components/TabBar';
import HomeScreen from '../screens/HomeScreen';
import ShopScreen from '../screens/ShopScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CameraScreen from '../screens/CameraScreen';

const SCREENS = {
  home: HomeScreen,
  favorites: FavoritesScreen,
  shop: ShopScreen,
  profile: ProfileScreen,
};

export default function MainTabs() {
  const [activeTab, setActiveTab] = useState('home');
  const [cameraOpen, setCameraOpen] = useState(false);
  const ActiveScreen = SCREENS[activeTab] || HomeScreen;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.flex}>
        <ActiveScreen />
      </View>
      <TabBar activeTab={activeTab} onChangeTab={setActiveTab} onOpenCamera={() => setCameraOpen(true)} />
      <Modal visible={cameraOpen} animationType="slide" presentationStyle="fullScreen" onRequestClose={() => setCameraOpen(false)}>
        {cameraOpen && <CameraScreen onClose={() => setCameraOpen(false)} />}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#120E0C' },
  flex: { flex: 1 },
});
