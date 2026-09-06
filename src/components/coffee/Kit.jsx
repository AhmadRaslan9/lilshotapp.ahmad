import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { coffee as c } from '../../theme/coffee';
export const ui = StyleSheet.create({
  page: { flex: 1, backgroundColor: c.bg },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 144, gap: 22 },
  row: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
  between: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  title: { color: c.text, fontSize: 30, lineHeight: 43, fontWeight: '800', textAlign: 'right' },
  subtitle: { color: c.muted, fontSize: 13, lineHeight: 22, textAlign: 'right' },
  heading: { color: c.text, fontSize: 20, fontWeight: '700', textAlign: 'right' },
  eyebrow: { color: c.accent, fontSize: 10, fontWeight: '700', letterSpacing: 2 },
  panel: { backgroundColor: c.surface, padding: 20, borderRadius: 24, borderWidth: 1, borderColor: c.line, gap: 12 },
});
export function IconButton({ icon, label, onPress, selected = false, glass = false, style }) {
  return <TouchableOpacity onPress={onPress} accessibilityRole="button" accessibilityLabel={label}
    accessibilityState={{ selected }} style={[s.icon, glass && s.glassIcon, selected && { backgroundColor: c.cream }, style]}>
    <Ionicons name={icon} size={21} color={selected ? c.dark : glass ? c.onPhoto : c.text} />
  </TouchableOpacity>;
}
export function Pill({ label, active, onPress, icon }) {
  return <TouchableOpacity onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: !!active }}
    style={[s.pill, active && s.pillActive]}>
    {icon && <Ionicons name={icon} size={15} color={active ? c.onPhoto : c.muted} />}
    <Text style={[s.pillText, active && { color: c.onPhoto }]}>{label}</Text>
  </TouchableOpacity>;
}
export function Button({ label, onPress, secondary, disabled, icon }) {
  return <TouchableOpacity onPress={onPress} disabled={disabled} accessibilityRole="button"
    accessibilityState={{ disabled: !!disabled }} style={[s.button, secondary && s.secondary, disabled && { opacity: 0.55 }]}>
    {icon && <Ionicons name={icon} color={secondary ? c.text : c.onPhoto} size={20} />}
    <Text style={{ color: secondary ? c.text : c.onPhoto, fontSize: 15, fontWeight: '700', textAlign: 'center' }}>{label}</Text>
  </TouchableOpacity>;
}
export function Photo({ uri, style, label }) {
  return <Image source={typeof uri === 'string' ? { uri } : uri} placeholder={require('../../assets/CoffeeShop.png')}
    contentFit="cover" accessibilityLabel={label} transition={180} style={[{ backgroundColor: c.raised }, style]} />;
}
export function DemoNote({ children = 'لقطات وأماكن تجريبية لاستكشاف التصميم' }) {
  return <View style={s.demo}><View style={s.dot} /><Text style={s.demoText}>{children}</Text></View>;
}
export function Empty({ icon = 'cafe-outline', title, text, action, onAction }) {
  return <View style={s.empty}>{icon && <View style={s.emptyIcon}><Ionicons name={icon} size={30} color={c.accent} /></View>}
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
  icon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: c.surface, borderWidth: 1, borderColor: c.line },
  glassIcon: { backgroundColor: c.glass, borderColor: 'rgba(255,255,255,0.2)' },
  pill: { minHeight: 44, paddingHorizontal: 17, borderRadius: 24, backgroundColor: c.surface, alignItems: 'center', justifyContent: 'center', flexDirection: 'row-reverse', gap: 7, borderWidth: 1, borderColor: c.line },
  pillActive: { backgroundColor: c.dark, borderColor: c.dark },
  pillText: { color: c.muted, fontSize: 12, fontWeight: '600' },
  button: { minHeight: 52, paddingHorizontal: 22, paddingVertical: 12, borderRadius: 28, backgroundColor: c.dark, alignItems: 'center', justifyContent: 'center', flexDirection: 'row-reverse', gap: 10 },
  secondary: { backgroundColor: c.raised, borderWidth: 1, borderColor: c.line },
  demo: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 7 },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: c.accent },
  demoText: { color: c.muted, fontSize: 10, textAlign: 'center', lineHeight: 17, flexShrink: 1 },
  empty: { padding: 24, alignItems: 'center', gap: 14 },
  emptyIcon: { width: 70, height: 70, borderRadius: 26, backgroundColor: c.raised, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', alignItems: 'center', justifyContent: 'flex-end' },
  sheet: { width: '100%', maxWidth: 480, maxHeight: '94%', backgroundColor: c.bg, borderTopLeftRadius: 32, borderTopRightRadius: 32, overflow: 'hidden', borderWidth: 1, borderColor: c.line },
  handle: { width: 40, height: 4, borderRadius: 3, backgroundColor: c.line, alignSelf: 'center', marginTop: 12 },
});
