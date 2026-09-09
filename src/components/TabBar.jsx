import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { coffee as c } from '../theme/coffee';
import { useLanguage } from '../context/LanguageContext';

export default function TabBar({ activeTab, onChangeTab, onOpenCamera }) {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const item = (id, icon, label) => {
    const active = activeTab === id;
    return <TouchableOpacity onPress={() => onChangeTab(id)} accessibilityRole="tab"
      accessibilityLabel={label} accessibilityState={{ selected: active }} style={[s.item, active && s.active]}>
      {id === 'shop' ? <Image source={require('../assets/nav-coffee.png')} resizeMode="contain" style={[s.coffeeIcon, !active && { opacity: 0.72 }]} />
        : <Ionicons name={active ? icon : `${icon}-outline`} size={21} color={active ? c.onPhoto : '#A9A9A9'} />}
    </TouchableOpacity>;
  };
  return <View style={[s.wrap, { bottom: Math.max(insets.bottom, 14) }]} pointerEvents="box-none">
    <View style={s.navigationRow}>
      <TouchableOpacity onPress={onOpenCamera} style={s.camera} accessibilityRole="button" accessibilityLabel="افتح الكاميرا" activeOpacity={0.86}>
        <Image source={require('../assets/nav-camera.png')} resizeMode="contain" style={s.cameraImage} />
      </TouchableOpacity>
      <View style={s.bar}>
        {item('profile', 'person', t('profile'))}
        {item('shop', 'storefront', t('shops'))}
        {item('home', 'home', t('home'))}
      </View>
    </View>
  </View>;
}
const s = StyleSheet.create({
  wrap: { position: 'absolute', left: 14, right: 14, alignItems: 'center' },
  navigationRow: { width: '100%', maxWidth: 430, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 14 },
  bar: { flex: 1, flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 7, paddingVertical: 7, borderRadius: 38, backgroundColor: 'rgba(7,7,7,0.94)', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.24, shadowRadius: 16, elevation: 10 },
  item: { flex: 1, minWidth: 0, height: 52, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
  active: { backgroundColor: '#343434' },
  coffeeIcon: { width: 25, height: 25 },
  camera: { width: 66, height: 66, borderRadius: 33, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center', shadowColor: '#B56A18', shadowOffset: { width: 0, height: 7 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 10 },
  cameraImage: { width: 31, height: 31 },
});
