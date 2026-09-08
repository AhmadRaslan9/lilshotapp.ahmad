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

export default function UserProfileScreen({ initialProfile, onClose }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(initialProfile);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(false);
  const [requested, setRequested] = useState(false);
  const [relationshipLoading, setRelationshipLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const uid = initialProfile.uid;
  const own = user?.uid === uid;
  const privateProfile = profile?.privacy === 'private';
  const canSeePosts = own || !privateProfile || following;
  useEffect(() => subscribeToProfile(uid, (value) => { if (value?.accountStatus === 'active') setProfile(value); else onClose(); }, () => setError('تعذّر تحديث بيانات الحساب.')), [uid]);
  useEffect(() => {
    const stopFollowers = subscribeToFollowersCount(uid, setFollowers, () => {});
    if (!canSeePosts) { setPosts([]); setLoading(false); return stopFollowers; }
    setLoading(true);
    const stopPosts = subscribeToVisibleUserPosts(uid, privateProfile ? 'followers' : 'public', (value) => { setPosts(value); setLoading(false); }, () => { setLoading(false); setError('تعذّر تحميل منشورات الحساب.'); });
    return () => { stopFollowers(); stopPosts(); };
  }, [canSeePosts, privateProfile, uid]);
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
      {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
      <View style={s.section}><Text style={ui.heading}>المنشورات</Text>{!canSeePosts ? <Empty icon="lock-closed-outline" title="هذا الحساب خاص" text="أرسل طلب متابعة. بعد قبول الطلب ستظهر منشورات الحساب هنا." /> : <>{loading && <ActivityIndicator color={c.accent} />}{!loading && !posts.length && <Empty icon="images-outline" title="لا توجد منشورات بعد" text="عندما ينشر هذا الحساب ستظهر منشوراته هنا." />}{posts.map((post) => <View key={post.id} style={s.post}><Photo uri={post.image} label={post.caption} style={s.postImage} /><View style={s.postBody}><Text style={s.caption}>{post.caption}</Text>{!!post.note && <Text style={ui.subtitle}>{post.note}</Text>}<View style={s.likeCount}><Ionicons name="heart" size={15} color="#B34F52" /><Text style={ui.subtitle}>{post.likes} إعجاب</Text></View></View></View>)}</>}</View>
    </View>
  </ScrollView></SafeAreaView>;
}

const s = StyleSheet.create({
  content: { paddingBottom: 60 }, cover: { height: 190, margin: 10, borderRadius: 28, overflow: 'hidden' }, back: { padding: 15, alignItems: 'flex-start' },
  body: { paddingHorizontal: 22, marginTop: -56, alignItems: 'center', gap: 11 }, avatar: { width: 96, height: 96, borderRadius: 48, borderWidth: 5, borderColor: c.bg, backgroundColor: c.cream, alignItems: 'center', justifyContent: 'center' }, avatarPhoto: { width: 86, height: 86, borderRadius: 43 }, initial: { color: c.accent, fontSize: 35, fontWeight: '700' },
  nameRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 }, name: { color: c.text, fontSize: 27, fontWeight: '700' }, username: { color: c.accent, fontSize: 11, writingDirection: 'ltr' }, bio: { color: c.muted, fontSize: 13, lineHeight: 21, textAlign: 'center' }, accountType: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  stats: { alignSelf: 'stretch', flexDirection: 'row-reverse', paddingVertical: 12 }, stat: { flex: 1, alignItems: 'center', gap: 4 }, statValue: { color: c.text, fontSize: 25, fontWeight: '700' }, statLabel: { color: c.muted, fontSize: 11 }, error: { color: c.danger, textAlign: 'center' },
  section: { alignSelf: 'stretch', gap: 15, marginTop: 12 }, post: { overflow: 'hidden', borderRadius: 24, backgroundColor: c.surface, borderWidth: 1, borderColor: c.line }, postImage: { height: 360, width: '100%' }, postBody: { padding: 16, gap: 8 }, caption: { color: c.text, fontSize: 16, fontWeight: '700', textAlign: 'right' }, likeCount: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
});
