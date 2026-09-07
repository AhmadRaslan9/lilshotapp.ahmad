import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import { Button } from '../../components/coffee/Kit';
import { coffee as c } from '../../theme/coffee';

const errorMessages = {
  'profile/invalid-name': 'اكتب اسماً من حرفين إلى 40 حرفاً.',
  'profile/invalid-username': 'اسم المستخدم 3–20 حرفاً إنجليزياً، ويمكن استخدام _ أو النقطة.',
  'profile/username-taken': 'اسم المستخدم مأخوذ. جرّب اسماً آخر.',
};

export default function ProfileSetupScreen() {
  const { user, signOut } = useAuth();
  const { createProfile } = useProfile();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [username, setUsername] = useState('');
  const [accountType, setAccountType] = useState('user');
  const [privacy, setPrivacy] = useState('public');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submit = async () => {
    setBusy(true); setError('');
    try { await createProfile({ displayName, username, accountType, privacy }); }
    catch (e) { setError(errorMessages[e.code] || 'تعذّر حفظ الحساب. تأكد من نشر قواعد Firestore.'); }
    finally { setBusy(false); }
  };
  return <SafeAreaView style={s.page}><ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
    <View style={s.brand}><View style={s.logo}><Ionicons name="camera" size={24} color={c.onPhoto} /></View><Text style={s.wordmark}>lilshot.</Text></View>
    <View><Text style={s.title}>خلّينا نجهّز حسابك</Text><Text style={s.subtitle}>اختر نوع الحساب والخصوصية، وبعدها تبدأ رحلتك.</Text></View>
    <View style={s.card}><Text style={s.label}>الاسم الظاهر</Text><TextInput value={displayName} onChangeText={setDisplayName} placeholder="كيف نناديك؟" placeholderTextColor={c.muted} style={s.input} textAlign="right" maxLength={40} />
      <Text style={s.label}>اسم المستخدم</Text><TextInput value={username} onChangeText={setUsername} placeholder="coffee_lover" placeholderTextColor={c.muted} style={s.input} textAlign="left" autoCapitalize="none" autoCorrect={false} maxLength={20} /></View>
    <Text style={s.section}>نوع الحساب</Text>
    {[
      ['user', 'person-outline', 'مستخدم', 'لحظات القهوة، المتابعة والنقاط'],
      ['cafe', 'storefront-outline', 'مقهى', 'صفحة متجر، منيو، موقع وتقييمات'],
    ].map(([id, icon, title, text]) => <TouchableOpacity key={id} onPress={() => setAccountType(id)} style={[s.option, accountType === id && s.selected]}><Ionicons name={icon} size={25} color={accountType === id ? c.onPhoto : c.accent} /><View style={{ flex: 1 }}><Text style={[s.optionTitle, accountType === id && s.white]}>{title}</Text><Text style={[s.optionText, accountType === id && s.softWhite]}>{text}</Text></View></TouchableOpacity>)}
    {accountType === 'cafe' && <View style={s.notice}><Text style={s.noticeText}>حساب المقهى يحتاج اشتراكاً قبل نشر المنيو والظهور في الاستكشاف.</Text></View>}
    <Text style={s.section}>الخصوصية</Text><View style={s.segment}>{[['public', 'عام'], ['private', 'خاص']].map(([id, label]) => <TouchableOpacity key={id} onPress={() => setPrivacy(id)} style={[s.segmentItem, privacy === id && s.selected]}><Text style={[s.segmentText, privacy === id && s.white]}>{label}</Text></TouchableOpacity>)}</View>
    <Text style={s.helper}>حتى الحساب العام يستخدم طلبات متابعة؛ أنت تقرر من يدخل دائرتك.</Text>
    {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
    <Button label={busy ? 'جارٍ تجهيز حسابك…' : 'ابدأ مع LilShot'} icon="arrow-back" disabled={busy} onPress={submit} />
    <TouchableOpacity onPress={signOut} style={s.logout}><Text style={s.helper}>تسجيل الخروج</Text></TouchableOpacity>
  </ScrollView></SafeAreaView>;
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: c.bg }, content: { width: '100%', maxWidth: 480, alignSelf: 'center', padding: 24, paddingBottom: 48, gap: 15 }, brand: { flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center', gap: 9 }, logo: { width: 46, height: 46, borderRadius: 18, backgroundColor: c.dark, alignItems: 'center', justifyContent: 'center' }, wordmark: { color: c.text, fontSize: 25, fontWeight: '800' }, title: { color: c.text, fontSize: 30, lineHeight: 43, fontWeight: '800', textAlign: 'right' }, subtitle: { color: c.muted, textAlign: 'right', lineHeight: 22 }, card: { padding: 18, borderRadius: 25, backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, gap: 9 }, label: { color: c.text, fontSize: 12, fontWeight: '700', textAlign: 'right' }, input: { minHeight: 52, borderRadius: 18, backgroundColor: c.raised, borderWidth: 1, borderColor: c.line, color: c.text, paddingHorizontal: 16 }, section: { color: c.text, fontSize: 16, fontWeight: '700', textAlign: 'right' }, option: { minHeight: 78, padding: 16, borderRadius: 22, backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, flexDirection: 'row-reverse', alignItems: 'center', gap: 13 }, selected: { backgroundColor: c.dark, borderColor: c.dark }, optionTitle: { color: c.text, fontSize: 15, fontWeight: '700', textAlign: 'right' }, optionText: { color: c.muted, fontSize: 11, textAlign: 'right', marginTop: 4 }, white: { color: c.onPhoto }, softWhite: { color: 'rgba(255,255,255,.72)' }, notice: { padding: 14, backgroundColor: c.cream, borderRadius: 17 }, noticeText: { color: c.accent, textAlign: 'right', fontSize: 11, lineHeight: 19 }, segment: { flexDirection: 'row-reverse', gap: 5, padding: 4, backgroundColor: c.raised, borderRadius: 24 }, segmentItem: { flex: 1, minHeight: 43, borderRadius: 21, justifyContent: 'center', alignItems: 'center' }, segmentText: { color: c.muted, fontWeight: '700' }, helper: { color: c.muted, textAlign: 'right', fontSize: 11, lineHeight: 19 }, error: { color: c.danger, textAlign: 'right', lineHeight: 21 }, logout: { alignItems: 'center', padding: 10 },
});
