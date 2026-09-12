import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { coffee as c } from '../theme/coffee';
import { useLanguage } from '../context/LanguageContext';
import { FadeInView, PressableScale } from './coffee/Motion';

const tabs = [
  { id: 'home' },
  { id: 'shop' },
  { id: 'profile' },
];
const homeIcon = require('../assets/nav-home-custom.png');
const profileIcon = require('../assets/nav-profile-custom.png');
const shopIcon = require('../assets/nav-coffee-machine.png');
const activeShopIcon = require('../assets/nav-coffee-machine-active.png');
const selectionSpring = {
  damping: 21,
  stiffness: 235,
  mass: 0.7,
  reduceMotion: ReduceMotion.System,
};

function TabItem({ tab, active, label, onPress }) {
  const selected = useSharedValue(active ? 1 : 0);
  useEffect(() => {
    selected.value = withSpring(active ? 1 : 0, selectionSpring);
  }, [active, selected]);
  const iconMotion = useAnimatedStyle(() => ({
    opacity: 0.58 + selected.value * 0.42,
    transform: [
      { translateY: selected.value * -1.5 },
      { scale: 1 + selected.value * 0.11 },
    ],
  }), []);

  return <PressableScale
    onPress={onPress}
    accessibilityRole="tab"
    accessibilityLabel={label}
    accessibilityState={{ selected: active }}
    style={s.item}
  >
    <Animated.View style={iconMotion}>
      {tab.id === 'shop'
        ? <Image
          source={active ? activeShopIcon : shopIcon}
          resizeMode="contain"
          style={s.coffeeIcon}
        />
        : <Image
          source={tab.id === 'home' ? homeIcon : profileIcon}
          resizeMode="contain"
          style={[s.tabIcon, { tintColor: active ? '#FFFFFF' : '#050505' }]}
        />}
    </Animated.View>
  </PressableScale>;
}

export default function TabBar({ activeTab, onChangeTab, onOpenCamera }) {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const [barWidth, setBarWidth] = useState(0);
  const translateX = useSharedValue(0);
  const itemWidth = Math.max(0, (barWidth - 8) / tabs.length);
  const activeIndex = Math.max(0, tabs.findIndex((tab) => tab.id === activeTab));

  useEffect(() => {
    if (itemWidth) translateX.value = withSpring(activeIndex * itemWidth, selectionSpring);
  }, [activeIndex, itemWidth, translateX]);

  const selectionStyle = useAnimatedStyle(() => ({
    width: itemWidth,
    transform: [{ translateX: translateX.value }],
  }), [itemWidth]);
  const labels = { home: t('home'), shop: t('shops'), profile: t('profile') };

  return <FadeInView delay={80} distance={16} style={[s.wrap, { bottom: Math.max(insets.bottom, 9) }]} pointerEvents="box-none">
    <View style={s.navigationRow}>
      <View style={s.barShadow}>
        <View style={s.bar} onLayout={(event) => setBarWidth(event.nativeEvent.layout.width)}>
          <BlurView intensity={62} tint="light" style={StyleSheet.absoluteFill} />
          {!!itemWidth && <Animated.View pointerEvents="none" style={[s.selection, selectionStyle]} />}
          {tabs.map((tab) => <TabItem
            key={tab.id}
            tab={tab}
            active={activeTab === tab.id}
            label={labels[tab.id]}
            onPress={() => onChangeTab(tab.id)}
          />)}
          <View pointerEvents="none" style={s.glassShine} />
        </View>
      </View>
      <PressableScale onPress={onOpenCamera} style={s.camera} accessibilityRole="button" accessibilityLabel={t('camera')}>
        <View pointerEvents="none" style={s.cameraShine} />
        <Image source={require('../assets/nav-camera-custom.png')} resizeMode="contain" style={s.cameraImage} />
      </PressableScale>
    </View>
  </FadeInView>;
}

const s = StyleSheet.create({
  wrap: { position: 'absolute', left: 16, right: 16, alignItems: 'center' },
  navigationRow: { width: '100%', maxWidth: 326, flexDirection: 'row', alignItems: 'center', gap: 7 },
  barShadow: { flex: 1, borderRadius: 28, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.14, shadowRadius: 20, elevation: 9 },
  bar: { height: 52, padding: 4, borderRadius: 28, flexDirection: 'row', alignItems: 'center', overflow: 'hidden', backgroundColor: 'rgba(248,248,250,0.78)', borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.84)' },
  selection: { position: 'absolute', left: 4, top: 4, bottom: 4, borderRadius: 23, backgroundColor: c.dark, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.19, shadowRadius: 8, elevation: 4 },
  glassShine: { position: 'absolute', left: 14, right: 14, top: 1, height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(255,255,255,0.96)' },
  item: { flex: 1, minWidth: 0, height: 44, borderRadius: 23, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  tabIcon: { width: 21, height: 21 },
  coffeeIcon: { width: 25, height: 25 },
  camera: { width: 54, height: 54, borderRadius: 27, overflow: 'hidden', backgroundColor: '#F7E7CF', borderWidth: 1, borderColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center', shadowColor: '#6B3D1E', shadowOffset: { width: 0, height: 7 }, shadowOpacity: 0.2, shadowRadius: 15, elevation: 9 },
  cameraShine: { position: 'absolute', left: 7, right: 7, top: 3, height: 14, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.42)' },
  cameraImage: { width: 25, height: 25 },
});
