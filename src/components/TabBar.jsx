import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { coffee as c } from '../theme/coffee';
import { useLanguage } from '../context/LanguageContext';
import { FadeInView, PressableScale } from './coffee/Motion';

export default function TabBar({ activeTab, onChangeTab, onOpenCamera }) {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const item = (id, icon, label) => {
    const active = activeTab === id;
    return <PressableScale onPress={() => onChangeTab(id)} accessibilityRole="tab"
      accessibilityLabel={label} accessibilityState={{ selected: active }} style={[s.item, active && s.active]}>
      {id === 'shop' ? <Image source={require('../assets/nav-coffee.png')} resizeMode="contain" style={[s.coffeeIcon, !active && { opacity: 0.72 }]} />
        : <Ionicons name={active ? icon : `${icon}-outline`} size={21} color={active ? c.onPhoto : '#A9A9A9'} />}
    </PressableScale>;
  };
  return <FadeInView delay={120} distance={18} style={[s.wrap, { bottom: Math.max(insets.bottom, 14) }]} pointerEvents="box-none">
    <View style={s.navigationRow}>
      <PressableScale onPress={onOpenCamera} style={s.camera} accessibilityRole="button" accessibilityLabel={t('camera')}>
        <Image source={require('../assets/nav-camera.png')} resizeMode="contain" style={s.cameraImage} />
      </PressableScale>
      <View style={s.bar}>
        {item('profile', 'person', t('profile'))}
        {item('shop', 'storefront', t('shops'))}
        {item('home', 'home', t('home'))}
      </View>
    </View>
  </FadeInView>;
}
const s = StyleSheet.create({
  wrap: { position: 'absolute', left: 18, right: 18, alignItems: 'center' },
  navigationRow: { width: '100%', maxWidth: 404, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  bar: { flex: 1, flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 4, paddingVertical: 4, borderRadius: 27, backgroundColor: 'rgba(255,255,255,0.94)', borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(60,60,67,0.18)', shadowColor: '#000', shadowOffset: { width: 0, height: 7 }, shadowOpacity: 0.12, shadowRadius: 18, elevation: 8 },
  item: { flex: 1, minWidth: 0, height: 43, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  active: { backgroundColor: c.dark },
  coffeeIcon: { width: 22, height: 22 },
  camera: { width: 53, height: 53, borderRadius: 27, backgroundColor: c.cream, borderWidth: StyleSheet.hairlineWidth, borderColor: '#E2C8A5', alignItems: 'center', justifyContent: 'center', shadowColor: '#6B3D1E', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.16, shadowRadius: 12, elevation: 7 },
  cameraImage: { width: 25, height: 25 },
});
