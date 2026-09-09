import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '../context/ProfileContext';
import { Button, IconButton, Photo, ui } from '../components/coffee/Kit';
import { emptyStoreDetails, normalizeStoreDetails, STORE_CATEGORIES, STORE_DAYS } from '../services/firebase/storeModel';
import { saveStoreDetails, subscribeToStoreDetails } from '../services/firebase/stores';
import { coffee as c } from '../theme/coffee';

const errorMessages = {
  'store/invalid-country': 'اكتب اسم الدولة من حرفين إلى 60 حرفاً.',
  'store/invalid-city': 'اكتب اسم المدينة من حرفين إلى 80 حرفاً.',
  'store/invalid-currency': 'اكتب رمز عملة عالمي من 3 أحرف مثل USD أو JOD.',
  'store/invalid-district': 'اكتب اسم الحي من حرفين إلى 60 حرفاً.',
  'store/invalid-address': 'اكتب عنواناً واضحاً من 3 إلى 160 حرفاً.',
  'store/invalid-description': 'وصف المقهى بحد أقصى 500 حرف.',
  'store/invalid-map': 'رابط الخريطة يجب أن يبدأ بـ https://',
  'store/invalid-url': 'أحد روابط الصور أو الخريطة طويل جداً.',
  'store/invalid-hours': 'وقت العمل لكل يوم بحد أقصى 40 حرفاً.',
  'permission-denied': 'لا تملك صلاحية تعديل معلومات هذا المتجر.',
};

export default function CafeStoreSettingsScreen({ onClose }) {
  const { profile } = useProfile();
  const [draft, setDraft] = useState(emptyStoreDetails);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!profile?.uid) return undefined;
    return subscribeToStoreDetails(profile.uid, (value) => {
      setDraft(normalizeStoreDetails(value || emptyStoreDetails)); setLoading(false);
    }, () => { setMessage('تعذّر تحميل معلومات المتجر. تأكد من نشر قواعد Firestore.'); setLoading(false); });
  }, [profile?.uid]);

  const change = (key, value) => { setDraft((old) => ({ ...old, [key]: value })); setMessage(''); setSuccess(false); };
  const changeHour = (key, value) => { setDraft((old) => ({ ...old, hours: { ...old.hours, [key]: value } })); setMessage(''); setSuccess(false); };
  const save = async () => {
    if (busy) return;
    setBusy(true); setMessage(''); setSuccess(false);
    try { await saveStoreDetails(profile.uid, draft); setSuccess(true); setMessage('تم حفظ معلومات المتجر وستظهر للزبائن مباشرة.'); }
    catch (error) { setMessage(errorMessages[error.code] || 'تعذّر الحفظ. جرّب مرة أخرى.'); }
    finally { setBusy(false); }
  };

  if (loading) return <View style={[ui.page, s.center]}><ActivityIndicator size="large" color={c.accent} /></View>;
  return <View style={ui.page}>
    <View style={s.header}><View><Text style={s.title}>معلومات المتجر</Text><Text style={s.subtitle}>ما يراه الزبائن عن المقهى</Text></View><IconButton icon="arrow-forward" label="العودة" onPress={onClose} /></View>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <View style={ui.panel}><Text style={ui.heading}>الموقع العالمي</Text><Text style={s.label}>الدولة</Text><TextInput value={draft.country} onChangeText={(value) => change('country', value)} maxLength={60} placeholder="مثال: الأردن أو United Kingdom" placeholderTextColor={c.muted} style={s.input} />
        <Text style={s.label}>المدينة</Text><TextInput value={draft.city} onChangeText={(value) => change('city', value)} maxLength={80} placeholder="مثال: عمّان أو London" placeholderTextColor={c.muted} style={s.input} />
        <Text style={s.label}>عملة المنيو</Text><TextInput value={draft.currency} onChangeText={(value) => change('currency', value.toUpperCase())} maxLength={3} autoCapitalize="characters" placeholder="USD" placeholderTextColor={c.muted} style={[s.input, s.ltr]} />
        <Text style={s.label}>الحي</Text><TextInput value={draft.district} onChangeText={(value) => change('district', value)} maxLength={60} placeholder="مثال: حطين" placeholderTextColor={c.muted} style={s.input} />
        <Text style={s.label}>العنوان</Text><TextInput value={draft.address} onChangeText={(value) => change('address', value)} maxLength={160} multiline placeholder="الشارع والمعلم القريب" placeholderTextColor={c.muted} style={[s.input, s.multiline]} />
        <Text style={s.label}>رابط الموقع على Google Maps</Text><TextInput value={draft.mapsURL} onChangeText={(value) => change('mapsURL', value)} autoCapitalize="none" keyboardType="url" placeholder="https://maps.app.goo.gl/..." placeholderTextColor={c.muted} style={[s.input, s.ltr]} /></View>
      <View style={ui.panel}><Text style={ui.heading}>هوية المقهى</Text><Text style={s.label}>نوع المقهى</Text><View style={s.choices}>{STORE_CATEGORIES.map((category) => <TouchableOpacity key={category} onPress={() => change('category', category)} style={[s.choice, draft.category === category && s.choiceActive]}><Text style={[s.choiceText, draft.category === category && s.choiceTextActive]}>{category}</Text></TouchableOpacity>)}</View>
        <Text style={s.label}>وصف المقهى</Text><TextInput value={draft.description} onChangeText={(value) => change('description', value)} maxLength={500} multiline placeholder="احكِ للزبائن عن المكان والقهوة والأجواء…" placeholderTextColor={c.muted} style={[s.input, s.description]} /><Text style={s.counter}>{draft.description.length} / 500</Text>
        <Text style={s.label}>رابط صورة الغلاف</Text><TextInput value={draft.coverURL} onChangeText={(value) => change('coverURL', value)} autoCapitalize="none" keyboardType="url" placeholder="https://..." placeholderTextColor={c.muted} style={[s.input, s.ltr]} />
        {!!draft.coverURL && <Photo uri={draft.coverURL} label="معاينة صورة الغلاف" style={s.coverPreview} />}
        <Text style={s.label}>رابط شعار المقهى</Text><TextInput value={draft.logoURL} onChangeText={(value) => change('logoURL', value)} autoCapitalize="none" keyboardType="url" placeholder="https://..." placeholderTextColor={c.muted} style={[s.input, s.ltr]} />
        {!!draft.logoURL && <Photo uri={draft.logoURL} label="معاينة شعار المقهى" style={s.logoPreview} />}</View>
      <View style={ui.panel}><Text style={ui.heading}>أوقات العمل</Text><Text style={s.help}>اكتب الوقت مثل: 7:00 ص – 12:00 ص، أو اكتب «مغلق».</Text>{STORE_DAYS.map(([key, label]) => <View key={key} style={s.dayRow}><Text style={s.day}>{label}</Text><TextInput value={draft.hours[key]} onChangeText={(value) => changeHour(key, value)} maxLength={40} placeholder="غير محدد" placeholderTextColor={c.muted} style={s.hourInput} /></View>)}</View>
      {!!message && <View style={ui.panel}><View style={s.messageRow}><Ionicons name={success ? 'checkmark-circle-outline' : 'alert-circle-outline'} size={20} color={success ? c.green : c.danger} /><Text accessibilityRole={!success ? 'alert' : undefined} style={[s.message, { color: success ? c.green : c.danger }]}>{message}</Text></View></View>}
      <Button label={busy ? 'جارٍ الحفظ…' : 'حفظ معلومات المتجر'} icon="checkmark-outline" disabled={busy} onPress={save} />
    </ScrollView>
  </View>;
}

const s = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' }, header: { padding: 18, flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: c.line },
  title: { color: c.text, fontSize: 24, fontWeight: '800', textAlign: 'right' }, subtitle: { color: c.muted, fontSize: 11, textAlign: 'right', marginTop: 3 }, content: { padding: 18, paddingBottom: 150, gap: 18 },
  label: { color: c.text, fontSize: 12, fontWeight: '700', textAlign: 'right' }, input: { minHeight: 52, paddingHorizontal: 15, paddingVertical: 12, borderRadius: 17, borderWidth: 1, borderColor: c.line, backgroundColor: c.raised, color: c.text, textAlign: 'right' },
  multiline: { minHeight: 78, textAlignVertical: 'top' }, description: { minHeight: 112, textAlignVertical: 'top' }, ltr: { textAlign: 'left', writingDirection: 'ltr' }, counter: { color: c.muted, fontSize: 10, textAlign: 'left' },
  choices: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8 }, choice: { paddingHorizontal: 13, paddingVertical: 9, borderRadius: 17, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface }, choiceActive: { backgroundColor: c.dark, borderColor: c.dark }, choiceText: { color: c.muted, fontSize: 11 }, choiceTextActive: { color: c.onPhoto },
  coverPreview: { height: 150, borderRadius: 20 }, logoPreview: { width: 82, height: 82, borderRadius: 41, alignSelf: 'center' }, help: { color: c.muted, fontSize: 11, lineHeight: 18, textAlign: 'right' },
  dayRow: { minHeight: 54, flexDirection: 'row-reverse', alignItems: 'center', gap: 12 }, day: { width: 65, color: c.text, fontSize: 12, fontWeight: '700', textAlign: 'right' }, hourInput: { flex: 1, minHeight: 45, paddingHorizontal: 13, borderRadius: 15, borderWidth: 1, borderColor: c.line, backgroundColor: c.raised, color: c.text, textAlign: 'right' },
  messageRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 9 }, message: { flex: 1, textAlign: 'right', lineHeight: 20 },
});
