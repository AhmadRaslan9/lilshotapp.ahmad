import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { coffee as c } from '../theme/coffee';
import { ui, Photo, Button, IconButton, Empty } from '../components/coffee/Kit';
import CafeMenuScreen from './CafeMenuScreen';
import CafeStoreSettingsScreen from './CafeStoreSettingsScreen';
import { subscribeToFollowersCount, subscribeToFollowingCount } from '../services/firebase/relationships';
import PostComposerScreen from './PostComposerScreen';
import { deletePost, subscribeToUserPosts } from '../services/firebase/posts';

export default function ProfileScreen({ onCamera, onPlus }) {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [tab, setTab] = useState('moment');
  const [settings, setSettings] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [storeSettingsOpen, setStoreSettingsOpen] = useState(false);
  const [followersCount, setFollowersCount] = useState(profile?.followersCount || 0);
  const [followingCount, setFollowingCount] = useState(profile?.followingCount || 0);
  const [postComposerOpen, setPostComposerOpen] = useState(false);
  const [ownPosts, setOwnPosts] = useState([]);
  const [postError, setPostError] = useState('');
  const [confirmPostId, setConfirmPostId] = useState(null);
  const name = profile?.displayName || user?.displayName || 'صديق القهوة';
  const stats = [profile?.momentsCount || 0, followersCount, followingCount, profile?.points || 0];
  const isCafe = profile?.accountType === 'cafe';
  const isPlus = profile?.plan === 'plus';
  const cafePlan = profile?.plan === 'cafe_pro' ? 'Pro' : profile?.plan === 'cafe_basic' ? 'Basic' : null;
  const cafeLive = isCafe && profile?.accountStatus === 'active' && Boolean(cafePlan);
  const statusText = isCafe
    ? (cafeLive ? `متجر ${cafePlan} نشط · جاهز للظهور` : 'المتجر بانتظار تفعيل الاشتراك')
    : (isPlus ? 'LilShot Plus · لحظات حتى 24 ساعة' : 'لحظات تُلتقط الآن · 8 ساعات');
  const primaryAction = isCafe ? (cafeLive ? 'إدارة واجهة المتجر' : 'عرض حالة الاشتراك') : 'صوّر لحظتك';
  const primaryIcon = isCafe ? 'storefront-outline' : 'camera-outline';

  useEffect(() => {
    if (!user?.uid || user.uid === 'demo-local') return undefined;
    const stopFollowers = subscribeToFollowersCount(user.uid, setFollowersCount, () => {});
    const stopFollowing = subscribeToFollowingCount(user.uid, setFollowingCount, () => {});
    return () => { stopFollowers(); stopFollowing(); };
  }, [user?.uid]);
  useEffect(() => {
    if (!user?.uid || user.uid === 'demo-local') return undefined;
    return subscribeToUserPosts(user.uid, setOwnPosts, () => setPostError('تعذّر تحميل منشوراتك الآن.'));
  }, [user?.uid]);

  if (settings) return <ProfileSettings key={user?.uid} onClose={() => setSettings(false)} />;
  if (menuOpen) return <CafeMenuScreen onClose={() => setMenuOpen(false)} />;
  if (storeSettingsOpen) return <CafeStoreSettingsScreen onClose={() => setStoreSettingsOpen(false)} />;
  if (postComposerOpen) return <PostComposerScreen onClose={() => { setPostComposerOpen(false); setTab('post'); }} />;

  return <View style={ui.page}><ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
    <View style={s.cover}>
      <Photo uri={require('../assets/CoffeeShop.png')} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={['rgba(45,30,20,0.3)', 'rgba(45,30,20,0.04)', 'rgba(45,30,20,0.3)']} style={StyleSheet.absoluteFill} />
      <View style={s.coverTop}><IconButton glass icon="settings-outline" label="إعدادات الحساب" onPress={() => setSettings(true)} /><Text style={s.coverLogo}>lilshot.</Text></View>
    </View>
    <View style={s.body}>
      <View style={s.avatar}>{user?.photoURL ? <Photo uri={user.photoURL} label="صورة حسابك" style={s.avatarPhoto} /> : <Text style={s.initial}>{Array.from(name)[0]}</Text>}</View>
      <View style={s.nameRow}><Text style={s.name}>{name}</Text>{profile?.verified && <View accessibilityLabel="حساب موثّق" style={s.verified}><Ionicons name="checkmark" size={12} color={c.onPhoto} /></View>}</View>
      <Text style={s.username}>@{profile?.username || 'lilshot'}</Text>
      {!!profile?.bio && <Text style={s.bio}>{profile.bio}</Text>}
      <View style={ui.row}><Ionicons name={isCafe ? 'storefront-outline' : profile?.privacy === 'private' ? 'lock-closed-outline' : 'globe-outline'} size={13} color={c.muted} /><Text style={s.bio}>{isCafe ? 'حساب مقهى' : profile?.privacy === 'private' ? 'حساب خاص' : 'حساب عام'}</Text></View>
      <View style={[s.status, isCafe && !cafeLive && s.pendingStatus]}><View style={[s.statusDot, isCafe && !cafeLive && s.pendingDot]} /><Text style={s.statusText}>{statusText}</Text></View>
      <View style={s.stats}>{[['اللحظات', 'camera-outline'], ['المتابعون', 'people-outline'], ['يتابع', 'person-add-outline'], ['النقاط', 'sparkles-outline']].map(([label], i) =>
        <View key={label} style={[s.stat, i > 0 && s.statDivider]}><Text style={s.statValue}>{stats[i]}</Text><Text style={s.statLabel}>{label}</Text></View>)}
      </View>
      <Text style={s.waiting}>{isCafe ? (cafeLive ? 'إحصاءات المتجر ستبدأ مع نشر المنيو والظهور.' : 'فعّل الاشتراك من الإدارة لتبدأ بنشر المنيو والظهور.') : 'إحصاءاتك تظهر مع تفعيل النشر والتفاعل'}</Text>
      <View style={s.actions}><View style={{ flex: 1 }}><Button label={primaryAction} onPress={isCafe ? () => setMenuOpen(true) : onCamera} icon={primaryIcon} /></View><IconButton icon="settings-outline" label="فتح إعدادات الحساب" onPress={() => setSettings(true)} style={{ width: 52, height: 52, borderRadius: 26 }} /></View>
      {isCafe ? <View style={[s.cafeCard, !cafeLive && s.cafePendingCard]}>
        <View style={s.cafeCardTop}><View style={s.cafeIcon}><Ionicons name="storefront-outline" color={c.onPhoto} size={22} /></View><View style={{ flex: 1 }}><Text style={s.cafeCardTitle}>{cafeLive ? `متجرك على خطة ${cafePlan}` : 'اشتراك المتجر'}</Text><Text style={s.cafeCardText}>{cafeLive ? 'المنيو، الموقع والعروض ستظهر لزوار متجرك.' : 'بانتظار تفعيل الإدارة قبل نشر المنيو أو الظهور في الاستكشاف.'}</Text></View></View>
        <Button label="تعديل معلومات المتجر" secondary icon="create-outline" onPress={() => setStoreSettingsOpen(true)} />
      </View> : <TouchableOpacity onPress={onPlus} accessibilityRole="button" accessibilityLabel="اكتشف مزايا Plus" style={[s.plus, isPlus && s.plusActive]}>
        <View style={s.plusIcon}><Ionicons name={isPlus ? 'checkmark-circle-outline' : 'sparkles-outline'} color={c.accent} size={24} /></View>
        <View style={{ flex: 1, gap: 4 }}><Text style={s.plusName}>{isPlus ? 'LilShot Plus مفعّل' : 'lilshot plus'}</Text><Text style={s.plusTag}>{isPlus ? 'بوستات دائمة ولحظات حتى 24 ساعة' : 'مساحة أكبر للحظاتك الحلوة'}</Text></View>
        <Ionicons name="arrow-back" size={20} color={c.accent} />
      </TouchableOpacity>}
      {(cafeLive || (isPlus && profile?.privacy === 'public')) && <View style={{ alignSelf: 'stretch' }}><Button label="إنشاء منشور جديد" icon="add-circle-outline" onPress={() => setPostComposerOpen(true)} /></View>}
      <View style={s.tabs}>{(isCafe ? [['menu', 'restaurant-outline', 'المنيو'], ['post', 'grid-outline', 'المنشورات']] : [['moment', 'time-outline', 'اللحظات'], ['post', 'grid-outline', 'البوستات']]).map(([id, icon, label]) =>
        <TouchableOpacity key={id} onPress={() => setTab(id)} accessibilityRole="tab" accessibilityLabel={label} accessibilityState={{ selected: tab === id }} style={[s.tab, tab === id && s.activeTab]}>
          <Ionicons name={icon} size={20} color={tab === id ? c.dark : c.muted} /><Text style={[s.tabText, tab === id && { color: c.dark }]}>{label}</Text>
        </TouchableOpacity>)}
      </View>
      {tab === 'post' && ownPosts.length ? <View style={s.postGrid}>{ownPosts.map((post) => <View key={post.id} style={s.postCard}>
        <Photo uri={post.image} label={`منشور ${post.caption}`} style={s.postImage} />
        <View style={s.postBody}><Text numberOfLines={2} style={s.postCaption}>{post.caption}</Text>{!!post.note && <Text numberOfLines={1} style={ui.subtitle}>{post.note}</Text>}<View style={ui.row}><Ionicons name="heart-outline" size={17} color={c.accent} /><Text style={ui.subtitle}>{post.likes} إعجاب</Text></View><Button label="حذف المنشور" secondary icon="trash-outline" onPress={() => setConfirmPostId(post.id)} /></View>
        {confirmPostId === post.id && <View style={s.deleteConfirm}><Text style={ui.subtitle}>متأكد من حذف المنشور نهائيًا؟</Text><View style={ui.row}><Button label="إلغاء" secondary onPress={() => setConfirmPostId(null)} /><Button label="نعم، احذف" onPress={async () => { try { await deletePost(post.id); setConfirmPostId(null); } catch { setPostError('تعذّر حذف المنشور.'); } }} /></View></View>}
      </View>)}</View> : <View style={s.galleryEmpty}>
        <View style={s.emptyFrames} pointerEvents="none"><View style={[s.frame, { transform: [{ rotate: '-9deg' }] }]} /><View style={[s.frame, s.frontFrame]}><Ionicons name={tab === 'moment' ? 'camera-outline' : 'images-outline'} size={34} color="#B39377" /></View></View>
        <Empty icon={null} title={tab === 'moment' ? 'أول لحظة، بداية حكاية' : 'للقطات اللي تستاهل تبقى'}
          text={isCafe ? (cafeLive ? (tab === 'post' ? 'أنشئ أول منشور لمتجرك؛ سيظهر هنا وفي الرئيسية مباشرة.' : 'أضف أصناف المنيو لتظهر لزوار متجرك.') : 'بعد تفعيل الاشتراك من لوحة الإدارة ستتمكن من تجهيز منيو متجرك والظهور في الاستكشاف.') : tab === 'moment' ? 'هذه مساحتك لصور القهوة. جرّب الكاميرا؛ نشر الصور يتوفر قريباً.' : isPlus ? 'أنشئ أول منشور دائم؛ سيظهر هنا وفي الرئيسية مباشرة.' : 'المنشورات الدائمة متاحة مع LilShot Plus.'}
          action={isCafe ? undefined : tab === 'moment' ? undefined : 'تعرّف على Plus'} onAction={onPlus} />
      </View>}
      {!!postError && <Text accessibilityRole="alert" style={{ color: c.danger, textAlign: 'center' }}>{postError}</Text>}
    </View>
  </ScrollView>
  </View>;
}

function ProfileSettings({ onClose }) {
  const { user, signOut, authError } = useAuth();
  const { profile, updateProfile } = useProfile();
  const [name, setName] = useState(profile?.displayName || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [privacy, setPrivacy] = useState(profile?.privacy || 'public');
  const [saved, setSaved] = useState(() => ({ name: profile?.displayName || '', bio: profile?.bio || '', privacy: profile?.privacy || 'public' }));
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [confirmClose, setConfirmClose] = useState(false);
  const inFlight = useRef(false);
  const busy = status === 'saving' || status === 'signing-out';
  const dirty = name.trim() !== saved.name || bio.trim() !== saved.bio || privacy !== saved.privacy;
  const change = (setter, value) => { setter(value); setStatus('idle'); setMessage(''); setConfirmClose(false); };
  const close = () => {
    if (inFlight.current) return;
    if (dirty) { setConfirmClose(true); return; }
    onClose();
  };
  const save = async () => {
    if (inFlight.current || !dirty) return;
    const next = { displayName: name.trim(), bio: bio.trim(), privacy };
    if (next.displayName.length < 2 || next.displayName.length > 40) {
      setStatus('error'); setMessage('اكتب اسماً من حرفين إلى 40 حرفاً.'); return;
    }
    if (next.bio.length > 160) { setStatus('error'); setMessage('النبذة بحد أقصى 160 حرفاً.'); return; }
    inFlight.current = true;
    setStatus('saving'); setMessage(''); setConfirmClose(false);
    try {
      await updateProfile(next);
      setName(next.displayName); setBio(next.bio);
      setSaved({ name: next.displayName, bio: next.bio, privacy });
      setStatus('success'); setMessage('تم حفظ تغييراتك بنجاح.');
    } catch (error) {
      setStatus('error');
      setMessage(error.code === 'permission-denied'
        ? 'لم يُسمح بحفظ التعديل. تأكد من تسجيل الدخول وقواعد الحساب.'
        : 'تعذّر الحفظ. احتفظنا بتعديلاتك هنا؛ تأكد من الاتصال وجرّب مجدداً.');
    } finally { inFlight.current = false; }
  };
  return <View style={ui.page}>
    <View style={s.settingsHeader}>
      <Text accessibilityRole="header" style={ui.heading}>إعدادات الحساب</Text>
      <Button label="رجوع" secondary disabled={busy} icon="arrow-forward" onPress={close} />
    </View>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.settingsContent}>
    <View style={ui.panel}>
      <Text style={ui.heading}>تفاصيلك</Text>
      <Text style={s.fieldLabel}>الاسم الظاهر</Text>
      <TextInput accessibilityLabel="الاسم الظاهر" value={name} onChangeText={(value) => change(setName, value)} editable={!busy} maxLength={40} style={s.field} placeholder="كيف نناديك؟" placeholderTextColor={c.muted} />
      <Text style={s.fieldLabel}>نبذة عنك</Text>
      <TextInput accessibilityLabel="نبذة عنك" value={bio} onChangeText={(value) => change(setBio, value)} editable={!busy} multiline maxLength={160} style={[s.field, s.bioField]} placeholder="احكِ لنا عن قهوتك المفضلة…" placeholderTextColor={c.muted} />
      <Text style={s.counter}>{bio.length} / 160</Text>
      <Text style={ui.subtitle}>اسم المستخدم: @{profile?.username}</Text>
      <Text style={[ui.subtitle, { writingDirection: 'ltr' }]}>{user?.email}</Text>
    </View>
    <View style={ui.panel}>
      <Text style={ui.heading}>خصوصية الحساب</Text>
      <View style={s.privacyOptions}>{[['public', 'globe-outline', 'عام'], ['private', 'lock-closed-outline', 'خاص']].map(([value, icon, label]) =>
        <TouchableOpacity key={value} disabled={busy} accessibilityRole="button" accessibilityLabel={`حساب ${label}`} accessibilityState={{ selected: privacy === value, disabled: busy }} onPress={() => change(setPrivacy, value)} style={[s.privacyOption, privacy === value && s.privacySelected]}>
          <Ionicons name={icon} size={18} color={privacy === value ? c.onPhoto : c.muted} /><Text style={{ color: privacy === value ? c.onPhoto : c.text }}>{label}</Text>
        </TouchableOpacity>)}</View>
      <Text style={ui.subtitle}>{privacy === 'private' ? 'ملفك الشخصي خاص حالياً. مشاركة الملف مع المتابعين ستتوفر عند تفعيل المتابعة.' : 'يمكن للمستخدمين المسجّلين الاطلاع على ملفك العام.'}</Text>
      <Text style={s.bio}>طلبات المتابعة ستتوفر في مرحلة لاحقة.</Text>
    </View>
    {!!message && <View accessibilityLiveRegion="polite" style={ui.panel}><Text accessibilityRole={status === 'error' ? 'alert' : undefined} style={[ui.subtitle, { color: status === 'error' ? c.danger : c.accent }]}>{message}</Text></View>}
    {status === 'saving' && <Text accessibilityLiveRegion="polite" style={ui.subtitle}>جارٍ انتظار تأكيد الحفظ. إذا انقطع الاتصال سيكتمل الحفظ عند عودته.</Text>}
    <Button label={status === 'saving' ? 'جارٍ الحفظ…' : 'حفظ التغييرات'} icon="checkmark-outline" disabled={busy || !dirty} onPress={save} />
    {confirmClose && <View style={ui.panel}><Text style={ui.subtitle}>عندك تعديلات غير محفوظة. هل تريد إغلاق الإعدادات بدون حفظها؟</Text><Button label="متابعة التعديل" secondary onPress={() => setConfirmClose(false)} /><Button label="تجاهل التعديلات وإغلاق" secondary onPress={onClose} /></View>}
    {authError && <Text accessibilityRole="alert" style={[ui.subtitle, { color: c.danger }]}>تعذّر تسجيل الخروج. جرّب مرة أخرى.</Text>}
    <Button label={status === 'signing-out' ? 'جارٍ تسجيل الخروج…' : 'تسجيل الخروج'} secondary icon="log-out-outline" disabled={busy || dirty} onPress={async () => {
      if (inFlight.current) return;
      inFlight.current = true; setStatus('signing-out'); setMessage('');
      try { await signOut(); } catch { setMessage('تعذّر تسجيل الخروج. جرّب مجدداً.'); }
      finally { inFlight.current = false; setStatus('idle'); }
    }} />
    </ScrollView>
  </View>;
}
const s = StyleSheet.create({
  settingsHeader: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: 18 },
  settingsContent: { padding: 20, paddingTop: 0, paddingBottom: 150, gap: 18 },
  fieldLabel: { color: c.text, fontSize: 13, fontWeight: '600', textAlign: 'right' },
  field: { minHeight: 52, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 18, borderWidth: 1, borderColor: c.line, backgroundColor: c.raised, color: c.text, fontSize: 15, textAlign: 'right', writingDirection: 'rtl' },
  bioField: { minHeight: 105, textAlignVertical: 'top' },
  counter: { color: c.muted, fontSize: 11, textAlign: 'left' },
  privacyOptions: { flexDirection: 'row-reverse', gap: 10 },
  privacyOption: { flex: 1, minHeight: 48, borderRadius: 24, borderWidth: 1, borderColor: c.line, flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: c.raised },
  privacySelected: { backgroundColor: c.dark, borderColor: c.dark },
  content: { paddingBottom: 144 },
  cover: { height: 196, margin: 10, marginBottom: 0, borderRadius: 27, overflow: 'hidden', backgroundColor: c.raised },
  coverTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15 },
  coverLogo: { color: c.onPhoto, fontSize: 22, fontWeight: '700', letterSpacing: -1 },
  body: { paddingHorizontal: 22, marginTop: -47, alignItems: 'center', gap: 12 },
  avatar: { width: 94, height: 94, borderRadius: 47, backgroundColor: c.cream, borderWidth: 5, borderColor: c.bg, alignItems: 'center', justifyContent: 'center' },
  avatarPhoto: { width: 84, height: 84, borderRadius: 42 },
  initial: { color: c.accent, fontSize: 37, fontWeight: '600' },
  name: { color: c.text, fontSize: 27, fontWeight: '700', textAlign: 'center', marginTop: 2 },
  nameRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 2 },
  verified: { width: 19, height: 19, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2C9DEB' },
  username: { color: c.accent, fontSize: 12, writingDirection: 'ltr' },
  bio: { color: c.muted, fontSize: 13, textAlign: 'center' },
  status: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7, backgroundColor: c.raised, borderRadius: 16 },
  statusDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: c.accent },
  statusText: { color: c.accent, fontSize: 10 },
  pendingStatus: { backgroundColor: '#FBF1E1' },
  pendingDot: { backgroundColor: '#C17C43' },
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
  plusActive: { borderWidth: 1, borderColor: '#E4CDAF' },
  cafeCard: { alignSelf: 'stretch', borderRadius: 24, padding: 17, backgroundColor: c.dark, gap: 12, marginVertical: 6 },
  cafePendingCard: { backgroundColor: '#A66D40' },
  cafeCardTop: { flexDirection: 'row-reverse', alignItems: 'center', gap: 12 },
  cafeIcon: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,.18)' },
  cafeCardTitle: { color: c.onPhoto, fontSize: 17, fontWeight: '700', textAlign: 'right' },
  cafeCardText: { color: 'rgba(255,255,255,.78)', fontSize: 11, lineHeight: 18, textAlign: 'right', marginTop: 4 },
  tabs: { flexDirection: 'row-reverse', alignSelf: 'stretch', borderBottomWidth: 1, borderColor: c.line },
  tab: { flex: 1, minHeight: 52, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, borderBottomWidth: 2, borderColor: 'transparent' },
  activeTab: { borderBottomColor: c.dark },
  tabText: { color: c.muted, fontSize: 12, fontWeight: '600' },
  galleryEmpty: { alignSelf: 'stretch', paddingTop: 30 },
  postGrid: { alignSelf: 'stretch', gap: 16, paddingTop: 18 },
  postCard: { overflow: 'hidden', borderRadius: 24, backgroundColor: c.surface, borderWidth: 1, borderColor: c.line },
  postImage: { width: '100%', height: 330 },
  postBody: { padding: 16, gap: 10 },
  postCaption: { color: c.text, fontSize: 16, fontWeight: '700', textAlign: 'right' },
  deleteConfirm: { padding: 16, borderTopWidth: 1, borderColor: c.line, backgroundColor: c.raised, gap: 12 },
  emptyFrames: { height: 120, width: 128, alignSelf: 'center' },
  frame: { position: 'absolute', left: 2, top: 0, width: 89, height: 112, borderRadius: 17, borderWidth: 1, borderColor: '#DCCDBC', backgroundColor: '#EEE5D9' },
  frontFrame: { left: 32, top: 8, backgroundColor: '#FBF7EF', transform: [{ rotate: '7deg' }], alignItems: 'center', justifyContent: 'center' },
});
