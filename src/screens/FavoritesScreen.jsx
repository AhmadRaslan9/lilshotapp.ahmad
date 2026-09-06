import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useCoffeePreview } from '../context/CoffeePreviewContext';
import { previewCafes } from '../data/coffeePreview';
import { ui, DemoNote, Empty } from '../components/coffee/Kit';
import CafeCard from '../components/coffee/CafeCard';

export default function FavoritesScreen({ onCafe, onExplore }) {
  const { saved } = useCoffeePreview();
  const cafes = previewCafes.filter(cafe => saved.includes(cafe.id));
  return <ScrollView style={ui.page} contentContainerStyle={ui.content} showsVerticalScrollIndicator={false}>
    <View><Text style={ui.eyebrow}>FOR ANOTHER COFFEE DAY</Text><Text style={[ui.title, { marginTop: 12 }]}>أماكن على بالك.</Text><Text style={ui.subtitle}>احفظ المقهى اللي ودّك ترجع له.</Text></View>
    <DemoNote>المحفوظات تجريبية وتبقى خلال هذه الجلسة فقط</DemoNote>
    {cafes.length ? cafes.map(cafe => <CafeCard key={cafe.id} cafe={cafe} onOpen={onCafe} />)
      : <Empty icon="bookmark-outline" title="قائمتك تنتظر أول مقهى" text="اضغط علامة الحفظ على أي مقهى، وتلقاه هنا." action="اكتشف المقاهي" onAction={onExplore} />}
  </ScrollView>;
}
