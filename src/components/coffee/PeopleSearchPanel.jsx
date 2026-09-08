import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { subscribeToPublicProfiles } from '../../services/firebase/publicProfiles';
import { filterPublicProfiles } from '../../services/firebase/publicProfileModel';
import { Empty, Photo, ui } from './Kit';
import { coffee as c } from '../../theme/coffee';
import { useBlocking } from '../../context/BlockingContext';
import { useAuth } from '../../context/AuthContext';

export default function PeopleSearchPanel({ onOpen }) {
  const { user } = useAuth();
  const { excludedIds } = useBlocking();
  const [search, setSearch] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const hasSearch = search.trim().replace(/^@/, '').length > 0;
  const visible = useMemo(() => filterPublicProfiles(profiles, search).filter((profile) => profile.uid !== user?.uid && !excludedIds.has(profile.uid)), [excludedIds, profiles, search, user?.uid]);
  useEffect(() => subscribeToPublicProfiles((value) => { setProfiles(value); setLoading(false); setError(''); }, (value) => {
    setLoading(false); setError(value.code === 'permission-denied' ? 'انشر قواعد Firestore الجديدة لتفعيل البحث.' : 'تعذّر تحميل الحسابات الآن.');
  }), []);
  return <View style={s.wrap}>
    <View style={s.search}><Ionicons name="search-outline" size={20} color={c.muted} /><TextInput value={search} onChangeText={setSearch} autoCapitalize="none" placeholder="الاسم أو @اسم_المستخدم" accessibilityLabel="ابحث عن مستخدم" placeholderTextColor={c.muted} style={s.input} /></View>
    {!hasSearch && <Empty icon="search-outline" title="ابحث عن حساب" text="اكتب الاسم أو اسم المستخدم، وستظهر الحسابات العامة المطابقة فقط." />}
    {hasSearch && <><View style={ui.between}><Text style={ui.heading}>نتائج البحث</Text><Text style={s.count}>{visible.length} حساب</Text></View>
    {loading && <ActivityIndicator color={c.accent} />}
    {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
    {!loading && !error && !visible.length && <Empty icon="person-outline" title="ما لقينا هذا الحساب" text="تأكد من الاسم أو اسم المستخدم ثم جرّب مرة ثانية." />}
    {visible.map((profile) => <TouchableOpacity key={profile.uid} onPress={() => onOpen(profile)} accessibilityRole="button" accessibilityLabel={`فتح حساب ${profile.displayName}`} style={s.person}>
      {profile.photoURL ? <Photo uri={profile.photoURL} label={`صورة ${profile.displayName}`} style={s.avatar} /> : <View style={s.avatar}><Text style={s.initial}>{Array.from(profile.displayName)[0]}</Text></View>}
      <View style={{ flex: 1, gap: 4 }}><View style={s.nameRow}><Text style={s.name}>{profile.displayName}</Text>{profile.verified && <Ionicons name="checkmark-circle" size={17} color="#2C9DEB" />}</View><Text style={s.username}>@{profile.username}</Text><Text numberOfLines={1} style={ui.subtitle}>{profile.bio}</Text></View>
      <View style={s.type}><Ionicons name={profile.privacy === 'private' ? 'lock-closed-outline' : profile.accountType === 'cafe' ? 'storefront-outline' : 'person-outline'} size={14} color={c.accent} /><Text style={s.typeText}>{profile.privacy === 'private' ? 'خاص' : profile.accountType === 'cafe' ? 'مقهى' : 'مستخدم'}</Text></View>
    </TouchableOpacity>)}</>}
  </View>;
}

const s = StyleSheet.create({
  wrap: { gap: 16 }, search: { backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, borderRadius: 27, flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 17, gap: 10 },
  input: { flex: 1, minHeight: 52, color: c.text, fontSize: 14, textAlign: 'right' }, count: { color: c.muted, fontSize: 11 }, error: { color: c.danger, textAlign: 'center' },
  person: { borderRadius: 23, padding: 14, backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, flexDirection: 'row-reverse', alignItems: 'center', gap: 12 },
  avatar: { width: 58, height: 58, borderRadius: 29, backgroundColor: c.cream, alignItems: 'center', justifyContent: 'center' }, initial: { color: c.accent, fontSize: 22, fontWeight: '700' },
  nameRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, justifyContent: 'flex-start' }, name: { color: c.text, fontSize: 15, fontWeight: '700', textAlign: 'right' }, username: { color: c.accent, fontSize: 10, textAlign: 'right', writingDirection: 'ltr' },
  type: { alignItems: 'center', gap: 3 }, typeText: { color: c.muted, fontSize: 9 },
});
