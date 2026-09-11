import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Photo, ui } from './Kit';
import { coffee as c } from '../../theme/coffee';
import { PressableScale } from './Motion';
export default function CafeCard({ cafe, onOpen }) {
  return <View style={s.card}>
    <PressableScale onPress={() => onOpen(cafe)} accessibilityRole="button" accessibilityLabel={`عرض مقهى ${cafe.name}`} style={s.photo}>
      <Photo uri={cafe.image || require('../../assets/CoffeeShop.png')} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.72)']} style={StyleSheet.absoluteFill} />
      <View style={s.tag}><Text style={s.tagText}>{cafe.tag}</Text></View>
      <View style={s.photoTitle}><Text style={s.latin}>{cafe.latin}</Text><View style={s.nameRow}><Text style={s.name}>{cafe.name}</Text>{cafe.verified && <View style={s.verified}><Ionicons name="checkmark" size={11} color={c.onPhoto} /></View>}</View></View>
    </PressableScale>
    <View style={[ui.between, s.footer]}><View style={ui.row}><Ionicons name="location-outline" size={15} color={c.muted} /><Text style={ui.subtitle}>{cafe.city} · {cafe.district}</Text></View>
      <View style={ui.row}><Ionicons name="star" size={13} color={c.accent} /><Text style={s.rating}>{cafe.rating}</Text><Text style={s.count}>({cafe.reviews})</Text></View></View>
  </View>;
}
const s = StyleSheet.create({ card: { borderRadius: 24, overflow: 'hidden', backgroundColor: c.surface, borderWidth: StyleSheet.hairlineWidth, borderColor: c.line, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.07, shadowRadius: 20, elevation: 3 }, photo: { height: 208, justifyContent: 'space-between', padding: 18 }, tag: { alignSelf: 'flex-end', backgroundColor: 'rgba(28,28,30,0.62)', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6, borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,.28)' }, tagText: { color: c.onPhoto, fontSize: 10, fontWeight: '600' }, photoTitle: { alignItems: 'flex-end', gap: 4 }, latin: { color: c.cream, letterSpacing: 2.2, fontSize: 10, fontWeight: '700' }, nameRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 7 }, name: { color: c.onPhoto, fontSize: 32, fontWeight: '800', letterSpacing: -0.5 }, verified: { width: 19, height: 19, borderRadius: 10, backgroundColor: '#0A84FF', alignItems: 'center', justifyContent: 'center' }, footer: { padding: 15 }, rating: { color: c.text, fontWeight: '700', fontSize: 13 }, count: { color: c.muted, fontSize: 10 } });
