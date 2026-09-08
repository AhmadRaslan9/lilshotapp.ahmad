import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Photo, ui } from './Kit';
import { coffee as c } from '../../theme/coffee';
export default function CafeCard({ cafe, onOpen }) {
  return <View style={s.card}>
    <TouchableOpacity onPress={() => onOpen(cafe)} accessibilityRole="button" accessibilityLabel={`عرض مقهى ${cafe.name}`} style={s.photo}>
      <Photo uri={cafe.image || require('../../assets/CoffeeShop.png')} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.72)']} style={StyleSheet.absoluteFill} />
      <View style={s.tag}><Text style={s.tagText}>{cafe.tag}</Text></View>
      <View style={s.photoTitle}><Text style={s.latin}>{cafe.latin}</Text><View style={s.nameRow}><Text style={s.name}>{cafe.name}</Text>{cafe.verified && <View style={s.verified}><Ionicons name="checkmark" size={11} color={c.onPhoto} /></View>}</View></View>
    </TouchableOpacity>
    <View style={[ui.between, s.footer]}><View style={ui.row}><Ionicons name="location-outline" size={15} color={c.muted} /><Text style={ui.subtitle}>{cafe.city} · {cafe.district}</Text></View>
      <View style={ui.row}><Ionicons name="star" size={13} color={c.accent} /><Text style={s.rating}>{cafe.rating}</Text><Text style={s.count}>({cafe.reviews})</Text></View></View>
  </View>;
}
const s = StyleSheet.create({ card: { borderRadius: 26, overflow: 'hidden', backgroundColor: c.surface, borderWidth: 1, borderColor: c.line }, photo: { height: 208, justifyContent: 'space-between', padding: 20 }, tag: { alignSelf: 'flex-end', backgroundColor: 'rgba(20,22,21,0.6)', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 5 }, tagText: { color: c.onPhoto, fontSize: 10 }, photoTitle: { alignItems: 'flex-end', gap: 4 }, latin: { color: c.cream, letterSpacing: 2.5, fontSize: 10 }, nameRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 7 }, name: { color: c.onPhoto, fontSize: 35, fontWeight: '700' }, verified: { width: 19, height: 19, borderRadius: 10, backgroundColor: '#2C9DEB', alignItems: 'center', justifyContent: 'center' }, footer: { padding: 16 }, rating: { color: c.text, fontWeight: '700', fontSize: 13 }, count: { color: c.muted, fontSize: 10 } });
