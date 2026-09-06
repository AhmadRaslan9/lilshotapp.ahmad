import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { coffee as c } from '../theme/coffee';

export default function TabBar({ activeTab, onChangeTab, onOpenCamera }) {
  const insets = useSafeAreaInsets();
  const item = (id, icon, label) => {
    const active = activeTab === id;
    return <TouchableOpacity onPress={() => onChangeTab(id)} accessibilityRole="tab"
      accessibilityLabel={label} accessibilityState={{ selected: active }} style={s.item}>
      <View style={[s.itemIcon, active && s.active]}>
        <Ionicons name={active ? icon : `${icon}-outline`} size={20} color={active ? c.dark : '#E5DCD2'} />
      </View>
      <Text style={[s.label, active && { color: c.onPhoto }]}>{label}</Text>
    </TouchableOpacity>;
  };
  return <View style={[s.wrap, { bottom: Math.max(insets.bottom, 14) }]} pointerEvents="box-none">
    <BlurView intensity={70} tint="dark" style={s.bar}>
      {item('profile', 'person', 'حسابي')}
      {item('favorites', 'bookmark', 'محفوظاتي')}
      <TouchableOpacity onPress={onOpenCamera} style={s.camera} accessibilityRole="button"
        accessibilityLabel="افتح الكاميرا" activeOpacity={0.8}>
        <View style={s.cameraInner}><Ionicons name="camera" size={29} color={c.dark} /></View>
      </TouchableOpacity>
      {item('shop', 'compass', 'اكتشف')}
      {item('home', 'home', 'اللحظات')}
    </BlurView>
  </View>;
}
const s = StyleSheet.create({
  wrap: { position: 'absolute', left: 14, right: 14, alignItems: 'center' },
  bar: { width: '100%', maxWidth: 430, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 40, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,248,235,0.2)', backgroundColor: 'rgba(56,40,32,0.82)' },
  item: { flex: 1, minWidth: 0, minHeight: 58, alignItems: 'center', justifyContent: 'center', gap: 3 },
  itemIcon: { width: 38, height: 34, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  active: { backgroundColor: c.onPhoto },
  label: { color: '#DBCDC0', fontSize: 9, fontWeight: '500' },
  camera: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F6E6D0', padding: 4, marginHorizontal: 7 },
  cameraInner: { flex: 1, borderRadius: 29, borderWidth: 1, borderColor: '#B99979', alignItems: 'center', justifyContent: 'center' },
});
