import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { coffee as c } from '../theme/coffee';
import { ui, Photo, IconButton, Pill, Button, DemoNote } from '../components/coffee/Kit';
import { coffeePhotos } from '../data/coffeePreview';
import { useCoffeePreview } from '../context/CoffeePreviewContext';
export default function CafeDetailScreen({ cafe, onClose }) {
  const [tab, setTab] = useState('المنيو');
  const { saved, toggleSaved, requested, toggleRequest } = useCoffeePreview();
  const pending = requested.includes(cafe.id);
  return <SafeAreaView style={ui.page}><ScrollView contentContainerStyle={{ paddingBottom: 36 }} showsVerticalScrollIndicator={false}>
    <View style={s.hero}><Photo uri={cafe.image} style={StyleSheet.absoluteFill} /><LinearGradient colors={['rgba(0,0,0,0.15)','rgba(20,22,21,0.2)',c.bg]} style={StyleSheet.absoluteFill} />
      <View style={[ui.between, { padding: 20 }]}><IconButton glass icon="arrow-forward" label="العودة للمقاهي" onPress={onClose} /><IconButton glass icon={saved.includes(cafe.id) ? 'bookmark' : 'bookmark-outline'} label={saved.includes(cafe.id) ? 'إزالة المقهى من المحفوظات' : 'حفظ المقهى'} selected={saved.includes(cafe.id)} onPress={() => toggleSaved(cafe.id)} /></View>
      <View style={s.heroBottom}><Text style={ui.eyebrow}>{cafe.latin}</Text><Text style={s.name}>{cafe.name}</Text><Text style={ui.subtitle}>{cafe.city} · {cafe.district}</Text></View>
    </View>
    <View style={{ paddingHorizontal: 22, gap: 22 }}><DemoNote>حساب مقهى تجريبي · بيانات وأسعار توضيحية</DemoNote>
      <View style={s.stats}>{[[cafe.rating,'التقييم'],[String(cafe.reviews),'تقييم'],[cafe.followers,'متابع']].map(([value,label]) => <View key={label} style={s.stat}><Text style={s.value}>{value}</Text><Text style={ui.subtitle}>{label}</Text></View>)}</View>
      <Button label={pending ? 'إلغاء طلب المتابعة' : 'طلب متابعة'} icon={pending ? 'time-outline' : 'add'} onPress={() => toggleRequest(cafe.id)} secondary={pending} />
      <Text style={[ui.subtitle,{ textAlign: 'center' }]}>{pending ? 'طلب تجريبي معلّق؛ لم يُرسل إلى متجر حقيقي.' : 'طلبات المتابعة تحتاج قبول صاحب الحساب.'}</Text>
      <Text style={ui.subtitle}>{cafe.description}</Text>
      <View style={ui.row}>{['المنيو','المكان','التقييم'].map(t => <Pill key={t} label={t} active={tab === t} onPress={() => setTab(t)} />)}</View>
      {tab === 'المنيو' && <View style={ui.panel}><Text style={ui.eyebrow}>BREWED WITH CARE</Text>{cafe.menu.map((item,i) => <View key={item.name} style={[ui.between,s.menuRow,i === cafe.menu.length-1 && { borderBottomWidth: 0 }]}><View style={{ flex: 1, gap: 4 }}><Text style={s.menuName}>{item.name}</Text><Text style={ui.subtitle}>{item.note}</Text></View><Text style={s.price}>{item.price} ر.س</Text></View>)}</View>}
      {tab === 'المكان' && <View style={{ gap: 15 }}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1, gap: 10 }}><Photo uri={require('../assets/CoffeeShop.png')} style={{ height: 230, borderRadius: 20 }} /><Photo uri={coffeePhotos.cup} style={{ height: 130, borderRadius: 20 }} /></View>
          <View style={{ flex: 1, gap: 10 }}><Photo uri={coffeePhotos.table} style={{ height: 130, borderRadius: 20 }} /><Photo uri={coffeePhotos.pour} style={{ height: 230, borderRadius: 20 }} /></View>
        </View>
        <Text style={ui.subtitle}>صور توضيحية للأجواء. العنوان وأوقات العمل والاتجاهات تُضاف عند اعتماد المقهى الحقيقي.</Text>
      </View>}
      {tab === 'التقييم' && <View style={[ui.panel,{ alignItems: 'center' }]}><Text style={[s.value,{ fontSize: 48 }]}>{cafe.rating}</Text><View style={ui.row}>{[1,2,3,4,5].map(n => <Ionicons key={n} name="star" color={c.accent} size={24} />)}</View><Text style={ui.subtitle}>{cafe.reviews} تقييم توضيحي</Text><Text style={[ui.subtitle,{ textAlign: 'center' }]}>التقييمات الحقيقية وإضافة تقييمك تتوفر عند إطلاق المقاهي.</Text></View>}
    </View>
  </ScrollView></SafeAreaView>;
}
const s = StyleSheet.create({ hero: { height: 340, justifyContent: 'space-between' }, heroBottom: { padding: 24, alignItems: 'flex-end', gap: 7 }, name: { color: c.text, fontSize: 54, fontWeight: '700' }, stats: { flexDirection: 'row-reverse', paddingVertical: 8 }, stat: { flex: 1, alignItems: 'center', gap: 6 }, value: { color: c.text, fontSize: 27, fontWeight: '600' }, menuRow: { paddingVertical: 14, borderBottomWidth: 1, borderColor: c.line }, menuName: { color: c.text, textAlign: 'right', fontSize: 16, fontWeight: '600' }, price: { color: c.accent, fontSize: 14, fontWeight: '700' } });
