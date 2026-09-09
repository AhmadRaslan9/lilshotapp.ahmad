import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { Button, Empty, IconButton, Photo, ui } from '../components/coffee/Kit';
import { coffee as c } from '../theme/coffee';
import { subscribeToProfile } from '../services/firebase/profiles';
import { cancelFollowRequest, followProfile, requestFollowProfile, subscribeToFollowersCount, subscribeToFollowRequestState, subscribeToFollowState, unfollowProfile } from '../services/firebase/relationships';
import { relationshipErrorMessage } from '../services/firebase/relationshipModel';
import { subscribeToVisibleUserPosts } from '../services/firebase/posts';
import { subscribeToVisibleUserMoments } from '../services/firebase/moments';
import { remainingLabel } from '../data/coffeePreview';
import ReportButton from '../components/coffee/ReportButton';
import { useBlocking } from '../context/BlockingContext';
import { blockingErrorMessage } from '../services/firebase/blocking';

export default function UserProfileScreen({ initialProfile, onClose }) {
  const { user } = useAuth();
  const { block, blockedIds, blockedByIds } = useBlocking();
  const [profile, setProfile] = useState(initialProfile);
  const [posts, setPosts] = useState([]);
  const [moments, setMoments] = useState([]);
  const [momentsLoading, setMomentsLoading] = useState(true);
  const [now, setNow] = useState(Date.now());
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(false);
  const [requested, setRequested] = useState(false);
  const [relationshipLoading, setRelationshipLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmBlock, setConfirmBlock] = useState(false);
  const uid = initialProfile.uid;
  const own = user?.uid === uid;
  const blocked = blockedIds.has(uid);
  const blockedBy = blockedByIds.has(uid);
  const privateProfile = profile?.privacy === 'private';
  const canSeePosts = own || !privateProfile || following;
  useEffect(() => { if (!own && (blocked || blockedBy)) onClose(); }, [blocked, blockedBy, own, uid]);
  useEffect(() => subscribeToProfile(uid, (value) => { if (value?.accountStatus === 'active') setProfile(value); else onClose(); }, () => setError('تعذّر تحديث بيانات الحساب.')), [uid]);
  useEffect(() => {
    const stopFollowers = subscribeToFollowersCount(uid, setFollowers, () => {});
    if (!canSeePosts) { setPosts([]); setMoments([]); setLoading(false); setMomentsLoading(false); return stopFollowers; }
    setLoading(true); setMomentsLoading(true);
    const stopPosts = subscribeToVisibleUserPosts(uid, privateProfile ? 'followers' : 'public', (value) => { setPosts(value); setLoading(false); }, () => { setLoading(false); setError('تعذّر تحميل منشورات الحساب.'); });
    const stopMoments = subscribeToVisibleUserMoments(uid, privateProfile ? 'followers' : 'public', (value) => { setMoments(value); setMomentsLoading(false); }, () => { setMomentsLoading(false); setError('تعذّر تحميل لحظات الحساب.'); });
    return () => { stopFollowers(); stopPosts(); stopMoments(); };
  }, [canSeePosts, privateProfile, uid]);
  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(tick);
  }, []);
  useEffect(() => {
    if (!user?.uid || own) { setRelationshipLoading(false); return undefined; }
    let followReady = false; let requestReady = false;
    const ready = () => { if (followReady && requestReady) setRelationshipLoading(false); };
    const stopFollow = subscribeToFollowState(user.uid, uid, (value) => { setFollowing(value); followReady = true; ready(); }, (value) => { setError(relationshipErrorMessage(value)); followReady = true; ready(); });
    const stopRequest = subscribeToFollowRequestState(user.uid, uid, (value) => { setRequested(value); requestReady = true; ready(); }, (value) => { setError(relationshipErrorMessage(value)); requestReady = true; ready(); });
    return () => { stopFollow(); stopRequest(); };
  }, [own, uid, user?.uid]);
  const toggleFollow = async () => {
    if (own || busy) return;
    setBusy(true); setError('');
    try {
      if (following) await unfollowProfile(user.uid, uid);
      else if (privateProfile && requested) await cancelFollowRequest(user.uid, uid);
      else if (privateProfile) await requestFollowProfile(user.uid, uid);
      else await followProfile(user.uid, uid);
    }
    catch (value) { setError(relationshipErrorMessage(value)); }
    finally { setBusy(false); }
  };
  const confirmAndBlock = async () => {
    if (own || busy) return;
    setBusy(true); setError('');
    try { await block(profile); setConfirmBlock(false); onClose(); }
    catch (value) { setError(blockingErrorMessage(value)); }
    finally { setBusy(false); }
  };
  const name = profile.displayName || 'مستخدم LilShot';
  return <SafeAreaView style={ui.page}><ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
    <View style={s.cover}><Photo uri={require('../assets/CoffeeShop.png')} style={StyleSheet.absoluteFill} /><LinearGradient colors={['rgba(20,15,12,.12)','rgba(35,24,18,.65)']} style={StyleSheet.absoluteFill} /><View style={s.back}><IconButton glass icon="arrow-forward" label="العودة للبحث" onPress={onClose} /></View></View>
    <View style={s.body}><View style={s.avatar}>{profile.photoURL ? <Photo uri={profile.photoURL} label={`صورة ${name}`} style={s.avatarPhoto} /> : <Text style={s.initial}>{Array.from(name)[0]}</Text>}</View>
      <View style={s.nameRow}><Text style={s.name}>{name}</Text>{profile.verified && <Ionicons name="checkmark-circle" size={21} color="#2C9DEB" />}</View>
      <Text style={s.username}>@{profile.usernameLower || profile.username}</Text>
      {!!profile.bio && <Text style={s.bio}>{profile.bio}</Text>}
      <View style={s.accountType}><Ionicons name={privateProfile ? 'lock-closed-outline' : profile.accountType === 'cafe' ? 'storefront-outline' : 'person-outline'} size={15} color={c.accent} /><Text style={s.bio}>{privateProfile ? 'حساب خاص' : profile.accountType === 'cafe' ? 'حساب مقهى' : 'حساب عام'}</Text></View>
      <View style={s.stats}><View style={s.stat}><Text style={s.statValue}>{followers}</Text><Text style={s.statLabel}>متابعون</Text></View><View style={s.stat}><Text style={s.statValue}>{posts.length}</Text><Text style={s.statLabel}>منشورات</Text></View></View>
      <View style={{ alignSelf: 'stretch' }}><Button label={own ? 'هذا حسابك' : busy || relationshipLoading ? 'جارٍ التحديث…' : following ? 'إلغاء المتابعة' : requested ? 'إلغاء طلب المتابعة' : privateProfile ? 'طلب متابعة' : 'متابعة'} icon={following ? 'checkmark-circle-outline' : requested ? 'time-outline' : 'person-add-outline'} secondary={following || requested || own} disabled={own || busy || relationshipLoading} onPress={toggleFollow} /></View>
      {!own && !blocked && !blockedBy && <View style={s.safetyActions}><ReportButton targetType={profile.accountType === 'cafe' ? 'cafe' : 'account'} targetId={uid} targetOwnerUid={uid} targetLabel={name} targetPreview={profile.bio || ''} label="تبليغ عن الحساب" /><Button label="حظر الحساب" icon="ban-outline" secondary onPress={() => setConfirmBlock(true)} /></View>}
      {confirmBlock && <View style={[ui.panel, s.confirm]}><Text style={ui.heading}>حظر {name}؟</Text><Text style={ui.subtitle}>لن يرى أي منكما الآخر في البحث أو المحتوى، وستُحذف المتابعة وطلبات المتابعة بينكما.</Text><Button label={busy ? 'جارٍ الحظر…' : 'نعم، احظر الحساب'} icon="ban-outline" disabled={busy} onPress={confirmAndBlock} /><Button label="إلغاء" secondary disabled={busy} onPress={() => setConfirmBlock(false)} /></View>}
      {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
      {!canSeePosts ? <View style={s.section}><Empty illustration={require('../assets/mascot-cup-peek.png')} title="هذا الحساب خاص" text="أرسل طلب متابعة. بعد قبول الطلب ستظهر لحظاته ومنشوراته هنا." /></View> : <><View style={s.section}><Text style={ui.heading}>اللحظات</Text>{momentsLoading && <ActivityIndicator color={c.accent} />}{!momentsLoading && !moments.filter((item) => item.expiresAt > now).length && <Empty illustration={require('../assets/mascot-cup-hug.png')} title="لا توجد لحظات الآن" text="لحظات هذا الحساب المنتهية تختفي تلقائيًا." />}{moments.filter((item) => item.expiresAt > now).map((moment) => <View key={moment.id} style={s.post}><Photo uri={moment.image} label={moment.caption} style={s.postImage} /><View style={s.postBody}><Text style={s.caption}>{moment.caption}</Text>{!!moment.note && <Text style={ui.subtitle}>{moment.note}</Text>}<View style={s.likeCount}><Ionicons name="time-outline" size={15} color={c.accent} /><Text style={ui.subtitle}>{remainingLabel(moment.expiresAt, now)}</Text></View><ReportButton targetType="moment" targetId={moment.id} targetOwnerUid={uid} targetLabel={`لحظة ${name}`} targetPreview={moment.caption} /></View></View>)}</View>
      <View style={s.section}><Text style={ui.heading}>المنشورات</Text>{loading && <ActivityIndicator color={c.accent} />}{!loading && !posts.length && <Empty illustration={require('../assets/mascot-blanket-coffee.png')} title="لا توجد منشورات بعد" text="عندما ينشر هذا الحساب ستظهر منشوراته هنا." />}{posts.map((post) => <View key={post.id} style={s.post}><Photo uri={post.image} label={post.caption} style={s.postImage} /><View style={s.postBody}><Text style={s.caption}>{post.caption}</Text>{!!post.note && <Text style={ui.subtitle}>{post.note}</Text>}<View style={s.likeCount}><Ionicons name="heart" size={15} color="#B34F52" /><Text style={ui.subtitle}>{post.likes} إعجاب</Text></View><ReportButton targetType="post" targetId={post.id} targetOwnerUid={uid} targetLabel={`منشور ${name}`} targetPreview={post.caption} /></View></View>)}</View></>}
    </View>
  </ScrollView></SafeAreaView>;
}

const s = StyleSheet.create({
  content: { paddingBottom: 60 }, cover: { height: 370, margin: 10, borderRadius: 34, overflow: 'hidden' }, back: { padding: 15, alignItems: 'flex-start' },
  body: { paddingHorizontal: 22, marginTop: -220, alignItems: 'center', gap: 11 }, avatar: { width: 98, height: 98, borderRadius: 49, borderWidth: 3, borderColor: 'rgba(255,255,255,.8)', backgroundColor: c.cream, alignItems: 'center', justifyContent: 'center' }, avatarPhoto: { width: 88, height: 88, borderRadius: 44 }, initial: { color: c.dark, fontSize: 35, fontWeight: '800' },
  nameRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 }, name: { color: c.onPhoto, fontSize: 31, fontWeight: '900' }, username: { color: c.cream, fontSize: 11, writingDirection: 'ltr' }, bio: { color: 'rgba(255,255,255,.84)', fontSize: 13, lineHeight: 21, textAlign: 'center' }, accountType: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  stats: { alignSelf: 'stretch', flexDirection: 'row-reverse', paddingVertical: 14, borderRadius: 22, backgroundColor: 'rgba(255,255,255,.18)', borderWidth: 1, borderColor: 'rgba(255,255,255,.22)' }, stat: { flex: 1, alignItems: 'center', gap: 4 }, statValue: { color: c.onPhoto, fontSize: 25, fontWeight: '800' }, statLabel: { color: 'rgba(255,255,255,.78)', fontSize: 11 }, error: { color: c.danger, textAlign: 'center' },
  section: { alignSelf: 'stretch', gap: 15, marginTop: 12 }, post: { overflow: 'hidden', borderRadius: 26, backgroundColor: '#111', borderWidth: 1, borderColor: '#242424' }, postImage: { height: 360, width: '100%' }, postBody: { padding: 16, gap: 8 }, caption: { color: c.onPhoto, fontSize: 16, fontWeight: '700', textAlign: 'right' }, likeCount: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  safetyActions: { alignSelf: 'stretch', gap: 10 }, confirm: { alignSelf: 'stretch', gap: 12 },
});
