import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { coffee as c } from '../../theme/coffee';
import { PressableScale } from './Motion';
export const ui = StyleSheet.create({
  page: { flex: 1, backgroundColor: c.bg },
  content: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: 136, gap: 18 },
  row: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
  between: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  title: { color: c.text, fontSize: 34, lineHeight: 42, fontWeight: '800', textAlign: 'right', letterSpacing: -0.8 },
  subtitle: { color: c.muted, fontSize: 13, lineHeight: 21, textAlign: 'right' },
  heading: { color: c.text, fontSize: 20, fontWeight: '700', textAlign: 'right', letterSpacing: -0.25 },
  eyebrow: { color: c.accent, fontSize: 10, fontWeight: '700', letterSpacing: 2 },
  panel: { backgroundColor: c.surface, padding: 18, borderRadius: 22, borderWidth: StyleSheet.hairlineWidth, borderColor: c.line, gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.04, shadowRadius: 14, elevation: 1 },
});
export function BrandMark({ size = 42, inverted = false, style }) {
  return <View accessibilityLabel="LilShot" style={[s.brand, inverted && s.brandLight, { width: size, height: size, borderRadius: size * 0.32 }, style]}>
    <Image source={require('../../assets/logo-mark.png')} contentFit="contain" style={{ width: size * 0.72, height: size * 0.72 }} />
  </View>;
}
export function IconButton({ icon, label, onPress, selected = false, glass = false, style }) {
  return <PressableScale onPress={onPress} accessibilityRole="button" accessibilityLabel={label}
    accessibilityState={{ selected }} style={[s.icon, glass && s.glassIcon, selected && { backgroundColor: c.cream }, style]}>
    <Ionicons name={icon} size={21} color={selected ? c.dark : glass ? c.onPhoto : c.text} />
  </PressableScale>;
}
export function Pill({ label, active, onPress, icon }) {
  return <PressableScale onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: !!active }}
    style={[s.pill, active && s.pillActive]}>
    {icon && <Ionicons name={icon} size={15} color={active ? c.onPhoto : c.muted} />}
    <Text style={[s.pillText, active && { color: c.onPhoto }]}>{label}</Text>
  </PressableScale>;
}
export function Button({ label, onPress, secondary, disabled, icon }) {
  return <PressableScale onPress={onPress} disabled={disabled} accessibilityRole="button"
    accessibilityState={{ disabled: !!disabled }} style={[s.button, secondary && s.secondary, disabled && { opacity: 0.55 }]}>
    {icon && <Ionicons name={icon} color={secondary ? c.text : c.onPhoto} size={20} />}
    <Text style={{ color: secondary ? c.text : c.onPhoto, fontSize: 15, fontWeight: '700', textAlign: 'center' }}>{label}</Text>
  </PressableScale>;
}
export function Photo({ uri, style, label }) {
  return <Image source={typeof uri === 'string' ? { uri } : uri} placeholder={require('../../assets/CoffeeShop.png')}
    contentFit="cover" accessibilityLabel={label} transition={180} style={[{ backgroundColor: c.raised }, style]} />;
}
export function DemoNote({ children = 'لقطات وأماكن تجريبية لاستكشاف التصميم' }) {
  return <View style={s.demo}><View style={s.dot} /><Text style={s.demoText}>{children}</Text></View>;
}
export function Empty({ icon = 'cafe-outline', illustration, title, text, action, onAction }) {
  return <View style={s.empty}>{illustration ? <Image source={illustration} contentFit="contain" style={s.emptyArt} /> : icon && <View style={s.emptyIcon}><Ionicons name={icon} size={30} color={c.accent} /></View>}
    <Text style={[ui.heading, { textAlign: 'center' }]}>{title}</Text>
    <Text style={[ui.subtitle, { textAlign: 'center', maxWidth: 280 }]}>{text}</Text>
    {action && <Button label={action} onPress={onAction} />}</View>;
}
export function Sheet({ visible, onClose, title, children }) {
  return <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
    <View style={s.backdrop}><SafeAreaView style={s.sheet} edges={['bottom', 'top']}>
      <View style={s.handle} /><View style={[ui.between, { padding: 20 }]}><Text style={ui.heading}>{title}</Text><IconButton icon="close" label="إغلاق" onPress={onClose} /></View>
      <ScrollView contentContainerStyle={{ padding: 22, paddingTop: 0, gap: 20, paddingBottom: 36 }} showsVerticalScrollIndicator={false}>{children}</ScrollView>
    </SafeAreaView></View>
  </Modal>;
}
const s = StyleSheet.create({
  brand: { backgroundColor: c.dark, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.16, shadowRadius: 12, elevation: 4 },
  brandLight: { backgroundColor: 'rgba(28,28,30,0.72)', borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.3)' },
  icon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: c.surface, borderWidth: StyleSheet.hairlineWidth, borderColor: c.line, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 1 },
  glassIcon: { backgroundColor: c.glass, borderColor: 'rgba(255,255,255,0.2)' },
  pill: { minHeight: 42, paddingHorizontal: 16, borderRadius: 21, backgroundColor: c.surface, alignItems: 'center', justifyContent: 'center', flexDirection: 'row-reverse', gap: 7, borderWidth: StyleSheet.hairlineWidth, borderColor: c.line },
  pillActive: { backgroundColor: c.dark, borderColor: c.dark },
  pillText: { color: c.muted, fontSize: 12, fontWeight: '600' },
  button: { minHeight: 50, paddingHorizontal: 22, paddingVertical: 12, borderRadius: 16, backgroundColor: c.dark, alignItems: 'center', justifyContent: 'center', flexDirection: 'row-reverse', gap: 10 },
  secondary: { backgroundColor: c.surface, borderWidth: StyleSheet.hairlineWidth, borderColor: c.line },
  demo: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 7 },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: c.accent },
  demoText: { color: c.muted, fontSize: 10, textAlign: 'center', lineHeight: 17, flexShrink: 1 },
  empty: { padding: 22, alignItems: 'center', gap: 12 },
  emptyIcon: { width: 70, height: 70, borderRadius: 26, backgroundColor: c.raised, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  emptyArt: { width: 138, height: 118, marginBottom: 4 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', alignItems: 'center', justifyContent: 'flex-end' },
  sheet: { width: '100%', maxWidth: 480, maxHeight: '94%', backgroundColor: c.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth, borderColor: c.line },
  handle: { width: 40, height: 4, borderRadius: 3, backgroundColor: c.line, alignSelf: 'center', marginTop: 12 },
});
