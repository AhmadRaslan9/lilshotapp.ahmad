import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { coffee as c } from '../theme/coffee';
import { previewCafes, filterCafes } from '../data/coffeePreview';
import { ui, Pill, Sheet, Button, DemoNote, Empty, BrandMark } from '../components/coffee/Kit';
import CafeCard from '../components/coffee/CafeCard';
import { subscribeToActiveCafes } from '../services/firebase/cafes';
import { filterPublicCafes } from '../services/firebase/cafeModel';
import { STORE_CATEGORIES } from '../services/firebase/storeModel';
import { useBlocking } from '../context/BlockingContext';

export default function ShopScreen({ onCafe, onPartner }) {
  const { excludedIds } = useBlocking();
  const [city, setCity] = useState('الكل');
  const [category, setCategory] = useState('الكل');
  const [query, setQuery] = useState('');
  const [citiesOpen, setCitiesOpen] = useState(false);
  const [liveCafes, setLiveCafes] = useState([]);
  const [liveLoading, setLiveLoading] = useState(true);
  const [liveError, setLiveError] = useState('');
  const cafes = filterCafes(previewCafes, city, category, query);
  const cityOptions = useMemo(() => ['الكل', ...new Set([...liveCafes, ...previewCafes].map((item) => item.city).filter(Boolean))], [liveCafes]);
  const visibleLiveCafes = useMemo(() => filterPublicCafes(liveCafes, query, city, category).filter((cafe) => !excludedIds.has(cafe.id)), [category, city, excludedIds, liveCafes, query]);
  useEffect(() => subscribeToActiveCafes((value) => {
    setLiveCafes(value); setLiveLoading(false); setLiveError('');
  }, (error) => {
    setLiveLoading(false);
    setLiveError(error.code === 'permission-denied' ? 'انشر قواعد Firestore الجديدة لعرض المقاهي.' : 'تعذّر تحميل المقاهي الحقيقية حالياً.');
  }, excludedIds), [excludedIds]);
  return <View style={ui.page}>
    <ScrollView contentContainerStyle={ui.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <View style={ui.between}><BrandMark size={48} /><Pill label={city === 'الكل' ? 'كل المدن' : city} icon="location-outline" onPress={() => setCitiesOpen(true)} /></View>
      <View><Text style={ui.title}>كوب جديد،\nومكان تحبّه.</Text><Text style={ui.subtitle}>تصفّح المقاهي، وشوف الحكاية وراء كل كوب.</Text></View>
      <View style={s.search}><Ionicons name="search-outline" size={20} color={c.muted} />
        <TextInput value={query} onChangeText={setQuery} placeholder="اسم المقهى أو الحي" accessibilityLabel="ابحث عن مقهى" placeholderTextColor={c.muted} style={s.input} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[ui.row, { flexGrow: 1 }]}>
        {['الكل', ...STORE_CATEGORIES].map(label => <Pill key={label} label={label} active={category === label} onPress={() => setCategory(label)} />)}
      </ScrollView>
      <View style={ui.between}><Text style={ui.heading}>مقاهي LilShot</Text><Text style={s.count}>{visibleLiveCafes.length} متاح</Text></View>
      {liveLoading && <ActivityIndicator color={c.accent} />}
      {!!liveError && <View style={s.liveMessage}><Text style={s.liveMessageText}>{liveError}</Text></View>}
      {!liveLoading && !liveError && !visibleLiveCafes.length && <View style={s.liveMessage}><Ionicons name="storefront-outline" size={23} color={c.accent} /><Text style={s.liveMessageText}>{liveCafes.length ? 'لا يوجد مقهى حقيقي يطابق البحث.' : 'لا يوجد مقهى عام ومفعّل بعد. فعّل متجرًا من لوحة الأدمن ليظهر هنا.'}</Text></View>}
      {visibleLiveCafes.map(cafe => <CafeCard key={cafe.id} cafe={cafe} onOpen={onCafe} />)}
      <View style={ui.between}><Text style={ui.heading}>أماكن للتجربة</Text><Text style={s.count}>{cafes.length} نماذج</Text></View>
      <DemoNote>مقاهٍ توضيحية · اكتشاف الموقع الفعلي قريباً</DemoNote>
      {cafes.map(cafe => <CafeCard key={cafe.id} cafe={cafe} onOpen={onCafe} />)}
      {!cafes.length && <Empty illustration={require('../assets/mascot-cup-peek.png')} title="لسّه ما في مقهى هون" text="جرّب اسم ثاني أو غيّر المدينة والفئة." action="مسح الفلاتر" onAction={() => { setQuery(''); setCategory('الكل'); setCity('الكل'); }} />}
      <View style={s.partner}><Ionicons name="storefront-outline" size={30} color={c.accent} /><Text style={ui.heading}>لمقهاك مكان بيننا</Text><Text style={ui.subtitle}>خلّ عشّاق القهوة يكتشفون مكانك، منيوك، وتفاصيلك.</Text><Button label="تعرّف على حساب المقهى" onPress={onPartner} secondary /></View>
    </ScrollView>
    <Sheet visible={citiesOpen} onClose={() => setCitiesOpen(false)} title="وين قهوتك اليوم؟">
      {cityOptions.map(label => <Button key={label} label={label === 'الكل' ? 'كل المدن' : label} secondary={city !== label} onPress={() => { setCity(label); setCitiesOpen(false); }} />)}
      <Text style={ui.subtitle}>تظهر المدن تلقائيًا من المقاهي المسجلة حول العالم.</Text>
    </Sheet>
  </View>;
}
const s = StyleSheet.create({
  search: { backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, borderRadius: 27, flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 17, gap: 10 },
  input: { flex: 1, minWidth: 0, minHeight: 52, fontSize: 14, color: c.text, textAlign: 'right' },
  count: { color: c.muted, fontSize: 12 },
  partner: { backgroundColor: c.cream, borderRadius: 28, padding: 24, gap: 14, alignItems: 'stretch', marginTop: 4 },
  liveMessage: { minHeight: 78, padding: 17, borderRadius: 21, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 10 },
  liveMessageText: { color: c.muted, fontSize: 12, lineHeight: 20, textAlign: 'center', flexShrink: 1 },
});
