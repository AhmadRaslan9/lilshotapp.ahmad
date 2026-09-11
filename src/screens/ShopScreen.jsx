import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { coffee as c } from '../theme/coffee';
import { previewCafes, filterCafes } from '../data/coffeePreview';
import { ui, Pill, Sheet, Button, DemoNote, Empty, BrandMark } from '../components/coffee/Kit';
import CafeCard from '../components/coffee/CafeCard';
import { subscribeToActiveCafes } from '../services/firebase/cafes';
import { filterPublicCafes } from '../services/firebase/cafeModel';
import { STORE_CATEGORIES } from '../services/firebase/storeModel';
import { useBlocking } from '../context/BlockingContext';
import { useLanguage } from '../context/LanguageContext';
import { FadeInView } from '../components/coffee/Motion';

export default function ShopScreen({ onCafe, onPartner }) {
  const { t } = useLanguage();
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
      <View style={ui.between}><BrandMark size={48} /><Pill label={city === 'الكل' ? t('allCities') : city} icon="location-outline" onPress={() => setCitiesOpen(true)} /></View>
      <FadeInView delay={35} style={s.hero}>
        <Image source={require('../assets/mascot-cup-peek.png')} contentFit="contain" style={s.heroArt} />
        <View style={s.heroCopy}><Text style={ui.title}>{t('shopHeadline')}</Text><Text style={ui.subtitle}>{t('shopSubtitle')}</Text></View>
      </FadeInView>
      <View style={s.search}><Ionicons name="search-outline" size={20} color={c.muted} />
        <TextInput value={query} onChangeText={setQuery} placeholder={t('cafeSearch')} accessibilityLabel={t('cafeSearch')} placeholderTextColor={c.muted} style={s.input} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[ui.row, { flexGrow: 1 }]}>
        {['الكل', ...STORE_CATEGORIES].map(label => <Pill key={label} label={label} active={category === label} onPress={() => setCategory(label)} />)}
      </ScrollView>
      <View style={ui.between}><Text style={ui.heading}>{t('globalShops')}</Text><Text style={s.count}>{visibleLiveCafes.length} متاح</Text></View>
      {liveLoading && <ActivityIndicator color={c.accent} />}
      {!!liveError && <View style={s.liveMessage}><Text style={s.liveMessageText}>{liveError}</Text></View>}
      {!liveLoading && !liveError && !visibleLiveCafes.length && <View style={s.liveMessage}><Ionicons name="storefront-outline" size={23} color={c.accent} /><Text style={s.liveMessageText}>{liveCafes.length ? 'لا يوجد مقهى حقيقي يطابق البحث.' : 'لا يوجد مقهى عام ومفعّل بعد. فعّل متجرًا من لوحة الأدمن ليظهر هنا.'}</Text></View>}
      {visibleLiveCafes.map((cafe, index) => <FadeInView key={cafe.id} delay={Math.min(index * 45, 180)}><CafeCard cafe={cafe} onOpen={onCafe} /></FadeInView>)}
      <View style={ui.between}><Text style={ui.heading}>{t('cafesNearYou')}</Text><Text style={s.count}>{cafes.length} {t('models')}</Text></View>
      <DemoNote>مقاهٍ توضيحية · اكتشاف الموقع الفعلي قريباً</DemoNote>
      {cafes.map((cafe, index) => <FadeInView key={cafe.id} delay={Math.min(index * 55, 220)}><CafeCard cafe={cafe} onOpen={onCafe} /></FadeInView>)}
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
  hero: { minHeight: 176, backgroundColor: c.surface, borderRadius: 28, padding: 20, flexDirection: 'row', alignItems: 'center', overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth, borderColor: c.line, shadowColor: '#000', shadowOffset: { width: 0, height: 7 }, shadowOpacity: 0.05, shadowRadius: 18, elevation: 2 },
  heroArt: { width: 122, height: 122, marginLeft: -18, marginBottom: -28 },
  heroCopy: { flex: 1, gap: 5 },
  search: { backgroundColor: c.surface, borderWidth: StyleSheet.hairlineWidth, borderColor: c.line, borderRadius: 16, flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 16, gap: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.035, shadowRadius: 10, elevation: 1 },
  input: { flex: 1, minWidth: 0, minHeight: 52, fontSize: 14, color: c.text, textAlign: 'right' },
  count: { color: c.muted, fontSize: 12 },
  partner: { backgroundColor: c.cream, borderRadius: 24, padding: 22, gap: 14, alignItems: 'stretch', marginTop: 4, borderWidth: StyleSheet.hairlineWidth, borderColor: '#E7D2B5' },
  liveMessage: { minHeight: 78, padding: 17, borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, borderColor: c.line, backgroundColor: c.surface, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 10 },
  liveMessageText: { color: c.muted, fontSize: 12, lineHeight: 20, textAlign: 'center', flexShrink: 1 },
});
