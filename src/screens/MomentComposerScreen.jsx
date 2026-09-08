import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProfile } from '../context/ProfileContext';
import { Button, Photo, ui } from '../components/coffee/Kit';
import { coffee as c } from '../theme/coffee';
import { createMoment } from '../services/firebase/moments';
import { emptyMoment, momentDurationHours, normalizeMomentInput, validateMomentInput } from '../services/firebase/momentModel';

const errorText = (code) => ({
  'moment/invalid-image-url': 'ضع رابط صورة صحيحًا يبدأ بـ https://',
  'moment/invalid-caption': 'اكتب وصفًا من حرف واحد إلى 220 حرفًا.',
  'moment/invalid-location': 'اسم المكان يجب ألا يتجاوز 100 حرف.',
  'moment/not-eligible': 'هذا الحساب غير متاح له نشر اللحظات الآن.',
  'permission-denied': 'لم تسمح قواعد Firebase بنشر هذه اللحظة.',
}[code] || 'تعذّر نشر اللحظة. تحقق من الاتصال وجرّب مجددًا.');

export default function MomentComposerScreen({ onClose }) {
  const { profile } = useProfile();
  const [draft, setDraft] = useState(emptyMoment);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const duration = momentDurationHours(profile);
  const change = (key, value) => { setDraft((old) => ({ ...old, [key]: value })); setError(''); setMessage(''); };
  const publish = async () => {
    const value = normalizeMomentInput(draft);
    const validationError = validateMomentInput(value);
    if (validationError) { setError(errorText(validationError)); return; }
    setBusy(true); setError(''); setMessage('');
    try {
      await createMoment(profile, value);
      setDraft(emptyMoment);
      setMessage(`تم نشر اللحظة لمدة ${duration} ساعة.`);
    } catch (value) { setError(errorText(value.code)); }
    finally { setBusy(false); }
  };
  return <SafeAreaView style={ui.page}>
    <View style={s.header}><Text style={ui.heading}>لحظة جديدة</Text><Button label="رجوع" secondary icon="arrow-forward" disabled={busy} onPress={onClose} /></View>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.content}>
      <View style={s.duration}><Text style={s.durationTitle}>{duration} ساعة</Text><Text style={ui.subtitle}>{profile?.privacy === 'private' ? 'ستظهر للمتابعين المقبولين فقط' : 'ستظهر للحسابات المسجّلة حتى انتهاء مدتها'}</Text></View>
      <View style={ui.panel}>
        <Text style={s.label}>رابط الصورة</Text>
        <TextInput accessibilityLabel="رابط صورة اللحظة" value={draft.imageURL} onChangeText={(value) => change('imageURL', value)} editable={!busy} autoCapitalize="none" keyboardType="url" style={s.field} placeholder="https://example.com/coffee.jpg" placeholderTextColor={c.muted} />
        <Text style={ui.subtitle}>مؤقتًا نستخدم رابط صورة مباشر حتى تفعيل Firebase Storage.</Text>
        {draft.imageURL.startsWith('https://') && <Photo uri={draft.imageURL} label="معاينة اللحظة" style={s.preview} />}
      </View>
      <View style={ui.panel}>
        <Text style={s.label}>وصف اللحظة</Text>
        <TextInput accessibilityLabel="وصف اللحظة" value={draft.caption} onChangeText={(value) => change('caption', value)} editable={!busy} multiline maxLength={220} style={[s.field, s.caption]} placeholder="احكِ عن هذه اللحظة…" placeholderTextColor={c.muted} />
        <Text style={s.counter}>{draft.caption.length} / 220</Text>
        <Text style={s.label}>المكان — اختياري</Text>
        <TextInput accessibilityLabel="مكان اللحظة" value={draft.locationName} onChangeText={(value) => change('locationName', value)} editable={!busy} maxLength={100} style={s.field} placeholder="اسم المقهى أو المدينة" placeholderTextColor={c.muted} />
      </View>
      {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
      {!!message && <Text accessibilityLiveRegion="polite" style={s.success}>{message}</Text>}
      <Button label={busy ? 'جارٍ النشر…' : 'نشر اللحظة'} icon="time-outline" disabled={busy} onPress={publish} />
    </ScrollView>
  </SafeAreaView>;
}

const s = StyleSheet.create({
  header: { padding: 18, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  content: { padding: 20, paddingTop: 0, paddingBottom: 100, gap: 18 },
  duration: { padding: 18, borderRadius: 22, backgroundColor: c.cream, gap: 5, alignItems: 'flex-end' },
  durationTitle: { color: c.accent, fontSize: 22, fontWeight: '800' },
  label: { color: c.text, fontSize: 13, fontWeight: '700', textAlign: 'right' },
  field: { minHeight: 52, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 18, borderWidth: 1, borderColor: c.line, backgroundColor: c.raised, color: c.text, fontSize: 14, textAlign: 'right' },
  caption: { minHeight: 120, textAlignVertical: 'top' }, counter: { color: c.muted, fontSize: 10, textAlign: 'left' }, preview: { height: 340, borderRadius: 22 },
  error: { color: c.danger, backgroundColor: '#FCE9E8', padding: 14, borderRadius: 16, textAlign: 'center' },
  success: { color: c.green, backgroundColor: '#E9F5EC', padding: 14, borderRadius: 16, textAlign: 'center' },
});
