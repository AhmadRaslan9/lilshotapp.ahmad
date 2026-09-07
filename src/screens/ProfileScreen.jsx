import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { coffee as c } from '../theme/coffee';
import { ui, Photo, Button, IconButton, Empty, Sheet } from '../components/coffee/Kit';

export default function ProfileScreen({ onCamera, onPlus }) {
  const { user, signOut, authError } = useAuth();
  const { profile } = useProfile();
  const [tab, setTab] = useState('moment');
  const [settings, setSettings] = useState(false);
  const [busy, setBusy] = useState(false);
  const name = profile?.displayName || user?.displayName || 'صديق القهوة';
  const stats = [profile?.momentsCount || 0, profile?.followersCount || 0, profile?.points || 0];

  return <View style={ui.page}><ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
    <View style={s.cover}>
      <Photo uri={require('../assets/CoffeeShop.png')} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={['rgba(45,30,20,0.3)', 'rgba(45,30,20,0.04)', 'rgba(45,30,20,0.3)']} style={StyleSheet.absoluteFill} />
      <View style={s.coverTop}><IconButton glass icon="settings-outline" label="إعدادات الحساب" onPress={() => setSettings(true)} /><Text style={s.coverLogo}>lilshot.</Text></View>
    </View>
    <View style={s.body}>
      <View style={s.avatar}>{user?.photoURL ? <Photo uri={user.photoURL} label="صورة حسابك" style={s.avatarPhoto} /> : <Text style={s.initial}>{Array.from(name)[0]}</Text>}</View>
      <Text style={s.name}>{name}</Text>
      <Text style={s.username}>@{profile?.username || 'lilshot'}</Text>
      <Text style={s.bio}>{profile?.bio || 'كل كوب، حكاية جديدة.'}</Text>
      <View style={s.status}><View style={s.statusDot} /><Text style={s.statusText}>لحظات تُلتقط الآن · 8 ساعات</Text></View>
      <View style={s.stats}>{[['اللحظات', 'camera-outline'], ['المتابعون', 'people-outline'], ['النقاط', 'sparkles-outline']].map(([label], i) =>
        <View key={label} style={[s.stat, i > 0 && s.statDivider]}><Text style={s.statValue}>{stats[i]}</Text><Text style={s.statLabel}>{label}</Text></View>)}
      </View>
      <Text style={s.waiting}>إحصاءاتك تظهر مع تفعيل النشر والتفاعل</Text>
      <View style={s.actions}><View style={{ flex: 1 }}><Button label="صوّر لحظتك" onPress={onCamera} icon="camera-outline" /></View><IconButton icon="settings-outline" label="فتح إعدادات الحساب" onPress={() => setSettings(true)} style={{ width: 52, height: 52, borderRadius: 26 }} /></View>
      <TouchableOpacity onPress={onPlus} accessibilityRole="button" accessibilityLabel="اكتشف مزايا Plus" style={s.plus}>
        <View style={s.plusIcon}><Ionicons name="sparkles-outline" color={c.accent} size={24} /></View>
        <View style={{ flex: 1, gap: 4 }}><Text style={s.plusName}>lilshot plus</Text><Text style={s.plusTag}>مساحة أكبر للحظاتك الحلوة</Text></View>
        <Ionicons name="arrow-back" size={20} color={c.accent} />
      </TouchableOpacity>
      <View style={s.tabs}>{[['moment', 'time-outline', 'اللحظات'], ['post', 'grid-outline', 'البوستات']].map(([id, icon, label]) =>
        <TouchableOpacity key={id} onPress={() => setTab(id)} accessibilityRole="tab" accessibilityLabel={label} accessibilityState={{ selected: tab === id }} style={[s.tab, tab === id && s.activeTab]}>
          <Ionicons name={icon} size={20} color={tab === id ? c.dark : c.muted} /><Text style={[s.tabText, tab === id && { color: c.dark }]}>{label}</Text>
        </TouchableOpacity>)}
      </View>
      <View style={s.galleryEmpty}>
        <View style={s.emptyFrames} pointerEvents="none"><View style={[s.frame, { transform: [{ rotate: '-9deg' }] }]} /><View style={[s.frame, s.frontFrame]}><Ionicons name={tab === 'moment' ? 'camera-outline' : 'images-outline'} size={34} color="#B39377" /></View></View>
        <Empty icon={null} title={tab === 'moment' ? 'أول لحظة، بداية حكاية' : 'للقطات اللي تستاهل تبقى'}
          text={tab === 'moment' ? 'هذه مساحتك لصور القهوة. جرّب الكاميرا؛ نشر الصور يتوفر قريباً.' : 'بوستات Plus تظهر هنا أثناء الاشتراك، وتُخفى عند انتهائه حتى التجديد.'}
          action={tab === 'moment' ? undefined : 'تعرّف على Plus'} onAction={onPlus} />
      </View>
    </View>
  </ScrollView>
    <Sheet visible={settings} onClose={() => setSettings(false)} title="إعدادات الحساب">
      <View style={ui.panel}><Text style={ui.heading}>{name}</Text><Text style={[ui.subtitle, { writingDirection: 'ltr' }]}>{user?.email}</Text></View>
      <View style={ui.panel}><View style={ui.row}><Ionicons name="lock-closed-outline" size={20} color={c.accent} /><Text style={ui.heading}>خصوصية الحساب</Text></View><Text style={ui.subtitle}>{profile?.privacy === 'private' ? 'حساب خاص' : 'حساب عام'} · المتابعة تتم عبر طلبات قبول.</Text></View>
      {authError && <Text accessibilityRole="alert" style={{ color: c.danger, textAlign: 'right' }}>تعذّر تسجيل الخروج. جرّب مرة أخرى.</Text>}
      <Button label={busy ? 'جارٍ تسجيل الخروج…' : 'تسجيل الخروج'} secondary disabled={busy} icon="log-out-outline" onPress={async () => { if (busy) return; setBusy(true); try { await signOut(); } finally { setBusy(false); } }} />
    </Sheet>
  </View>;
}
const s = StyleSheet.create({
  content: { paddingBottom: 144 },
  cover: { height: 196, margin: 10, marginBottom: 0, borderRadius: 27, overflow: 'hidden', backgroundColor: c.raised },
  coverTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15 },
  coverLogo: { color: c.onPhoto, fontSize: 22, fontWeight: '700', letterSpacing: -1 },
  body: { paddingHorizontal: 22, marginTop: -47, alignItems: 'center', gap: 12 },
  avatar: { width: 94, height: 94, borderRadius: 47, backgroundColor: c.cream, borderWidth: 5, borderColor: c.bg, alignItems: 'center', justifyContent: 'center' },
  avatarPhoto: { width: 84, height: 84, borderRadius: 42 },
  initial: { color: c.accent, fontSize: 37, fontWeight: '600' },
  name: { color: c.text, fontSize: 27, fontWeight: '700', textAlign: 'center', marginTop: 2 },
  username: { color: c.accent, fontSize: 12, direction: 'ltr' },
  bio: { color: c.muted, fontSize: 13, textAlign: 'center' },
  status: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7, backgroundColor: c.raised, borderRadius: 16 },
  statusDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: c.accent },
  statusText: { color: c.accent, fontSize: 10 },
  stats: { flexDirection: 'row-reverse', alignSelf: 'stretch', marginTop: 10, paddingVertical: 7 },
  stat: { flex: 1, alignItems: 'center', gap: 5 },
  statDivider: { borderRightWidth: 1, borderColor: c.line },
  statValue: { color: c.text, fontSize: 26, fontWeight: '600' },
  statLabel: { color: c.muted, fontSize: 11 },
  waiting: { color: c.muted, fontSize: 10, textAlign: 'center', marginBottom: 6 },
  actions: { alignSelf: 'stretch', flexDirection: 'row-reverse', gap: 10 },
  plus: { alignSelf: 'stretch', flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: c.cream, borderRadius: 24, padding: 17, gap: 13, marginVertical: 6 },
  plusIcon: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#FAF5EC', alignItems: 'center', justifyContent: 'center' },
  plusName: { color: c.dark, fontSize: 18, fontWeight: '700', textAlign: 'right' },
  plusTag: { color: c.accent, fontSize: 11, textAlign: 'right' },
  tabs: { flexDirection: 'row-reverse', alignSelf: 'stretch', borderBottomWidth: 1, borderColor: c.line },
  tab: { flex: 1, minHeight: 52, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, borderBottomWidth: 2, borderColor: 'transparent' },
  activeTab: { borderBottomColor: c.dark },
  tabText: { color: c.muted, fontSize: 12, fontWeight: '600' },
  galleryEmpty: { alignSelf: 'stretch', paddingTop: 30 },
  emptyFrames: { height: 120, width: 128, alignSelf: 'center' },
  frame: { position: 'absolute', left: 2, top: 0, width: 89, height: 112, borderRadius: 17, borderWidth: 1, borderColor: '#DCCDBC', backgroundColor: '#EEE5D9' },
  frontFrame: { left: 32, top: 8, backgroundColor: '#FBF7EF', transform: [{ rotate: '7deg' }], alignItems: 'center', justifyContent: 'center' },
});
