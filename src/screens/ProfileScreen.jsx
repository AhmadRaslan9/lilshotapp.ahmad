import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { coffee as c } from '../theme/coffee';
import { ui, Photo, Button, IconButton, Empty, BrandMark } from '../components/coffee/Kit';
import CafeMenuScreen from './CafeMenuScreen';
import CafeStoreSettingsScreen from './CafeStoreSettingsScreen';
import { subscribeToFollowersCount, subscribeToFollowingCount } from '../services/firebase/relationships';
import PostComposerScreen from './PostComposerScreen';
import { deletePost, subscribeToUserPosts } from '../services/firebase/posts';
import { deleteMoment, subscribeToOwnMoments } from '../services/firebase/moments';
import { remainingLabel } from '../data/coffeePreview';
import { useBlocking } from '../context/BlockingContext';
import { blockingErrorMessage } from '../services/firebase/blocking';
import { useLanguage } from '../context/LanguageContext';
import { hasActiveSubscription, subscriptionDaysLeft } from '../services/firebase/subscriptionModel';
import { FadeInView, PressableScale } from '../components/coffee/Motion';

export default function ProfileScreen({ onMoment, onPlus }) {
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
  const [ownMoments, setOwnMoments] = useState([]);
  const [now, setNow] = useState(Date.now());
  const [postError, setPostError] = useState('');
  const [confirmPostId, setConfirmPostId] = useState(null);
  const [confirmMomentId, setConfirmMomentId] = useState(null);
  const name = profile?.displayName || user?.displayName || 'صديق القهوة';
  const activeOwnMoments = ownMoments.filter((item) => item.expiresAt > now);
  const stats = [activeOwnMoments.length, followersCount, followingCount, profile?.points || 0];
  const isCafe = profile?.accountType === 'cafe';
  const subscriptionActive = hasActiveSubscription(profile);
  const daysLeft = subscriptionDaysLeft(profile);
  const isPlus = profile?.plan === 'plus' && subscriptionActive;
  const cafePlan = profile?.plan === 'cafe_pro' ? 'Pro' : profile?.plan === 'cafe_basic' ? 'Basic' : null;
  const cafeLive = isCafe && profile?.accountStatus === 'active' && Boolean(cafePlan) && subscriptionActive;
  const statusText = isCafe
    ? (cafeLive ? `متجر ${cafePlan} نشط${daysLeft === null ? '' : ` · ${daysLeft} يوم متبقٍ`}` : 'المتجر بانتظار تفعيل الاشتراك')
    : (isPlus ? `LilShot Plus${daysLeft === null ? '' : ` · ${daysLeft} يوم متبقٍ`}` : 'لحظات تُلتقط الآن · 8 ساعات');
  const primaryAction = isCafe ? (cafeLive ? 'إدارة واجهة المتجر' : 'عرض حالة الاشتراك') : 'أضف لحظة';
  const primaryIcon = isCafe ? 'storefront-outline' : 'time-outline';

  useEffect(() => {
    if (!user?.uid || user.uid === 'demo-local') return undefined;
    const stopFollowers = subscribeToFollowersCount(user.uid, setFollowersCount, () => {});
    const stopFollowing = subscribeToFollowingCount(user.uid, setFollowingCount, () => {});
    return () => { stopFollowers(); stopFollowing(); };
  }, [user?.uid]);
  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(tick);
  }, []);
  useEffect(() => {
    if (!user?.uid || user.uid === 'demo-local') return undefined;
    return subscribeToOwnMoments(user.uid, setOwnMoments, () => setPostError('تعذّر تحميل لحظاتك الآن.'));
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
    <FadeInView style={s.cover}>
      <Photo uri={require('../assets/CoffeeShop.png')} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.12)', 'rgba(0,0,0,0.82)']} style={StyleSheet.absoluteFill} />
      <View style={s.coverTop}><IconButton glass icon="settings-outline" label="إعدادات الحساب" onPress={() => setSettings(true)} /><BrandMark inverted size={48} /></View>
    </FadeInView>
    <FadeInView delay={90} distance={16} style={s.body}>
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
      <View style={s.actions}><View style={{ flex: 1 }}><Button label={primaryAction} onPress={isCafe ? () => setMenuOpen(true) : onMoment} icon={primaryIcon} /></View><IconButton icon="settings-outline" label="فتح إعدادات الحساب" onPress={() => setSettings(true)} style={{ width: 52, height: 52, borderRadius: 26 }} /></View>
      {isCafe ? <View style={[s.cafeCard, !cafeLive && s.cafePendingCard]}>
        <View style={s.cafeCardTop}><View style={s.cafeIcon}><Ionicons name="storefront-outline" color={c.onPhoto} size={22} /></View><View style={{ flex: 1 }}><Text style={s.cafeCardTitle}>{cafeLive ? `متجرك على خطة ${cafePlan}` : 'اشتراك المتجر'}</Text><Text style={s.cafeCardText}>{cafeLive ? 'المنيو، الموقع والعروض ستظهر لزوار متجرك.' : 'بانتظار تفعيل الإدارة قبل نشر المنيو أو الظهور في الاستكشاف.'}</Text></View></View>
        <Button label="تعديل معلومات المتجر" secondary icon="create-outline" onPress={() => setStoreSettingsOpen(true)} />
      </View> : <PressableScale onPress={onPlus} accessibilityRole="button" accessibilityLabel="اكتشف مزايا Plus" style={[s.plus, isPlus && s.plusActive]}>
        <View style={s.plusIcon}><Ionicons name={isPlus ? 'checkmark-circle-outline' : 'sparkles-outline'} color={c.accent} size={24} /></View>
        <View style={{ flex: 1, gap: 4 }}><Text style={s.plusName}>{isPlus ? 'LilShot Plus مفعّل' : 'lilshot plus'}</Text><Text style={s.plusTag}>{isPlus ? 'بوستات دائمة ولحظات حتى 24 ساعة' : 'مساحة أكبر للحظاتك الحلوة'}</Text></View>
        <Ionicons name="arrow-back" size={20} color={c.accent} />
      </PressableScale>}
      {(cafeLive || isPlus) && <View style={{ alignSelf: 'stretch' }}><Button label="إنشاء منشور جديد" icon="add-circle-outline" onPress={() => setPostComposerOpen(true)} /></View>}
      <View style={s.tabs}>{(isCafe ? [['menu', 'restaurant-outline', 'المنيو'], ['post', 'grid-outline', 'المنشورات']] : [['moment', 'time-outline', 'اللحظات'], ['post', 'grid-outline', 'البوستات']]).map(([id, icon, label]) =>
        <PressableScale key={id} onPress={() => setTab(id)} accessibilityRole="tab" accessibilityLabel={label} accessibilityState={{ selected: tab === id }} style={[s.tab, tab === id && s.activeTab]}>
          <Ionicons name={icon} size={20} color={tab === id ? c.dark : c.muted} /><Text style={[s.tabText, tab === id && { color: c.dark }]}>{label}</Text>
        </PressableScale>)}
      </View>
      {tab === 'moment' && activeOwnMoments.length ? <View style={s.postGrid}>{activeOwnMoments.map((moment) => <View key={moment.id} style={s.postCard}>
        <Photo uri={moment.image} label={`لحظة ${moment.caption}`} style={s.postImage} />
        <View style={s.postBody}><Text numberOfLines={2} style={s.postCaption}>{moment.caption}</Text>{!!moment.note && <Text numberOfLines={1} style={ui.subtitle}>{moment.note}</Text>}<View style={ui.row}><Ionicons name="time-outline" size={17} color={c.accent} /><Text style={ui.subtitle}>{remainingLabel(moment.expiresAt, now)}</Text></View><Button label="حذف اللحظة" secondary icon="trash-outline" onPress={() => setConfirmMomentId(moment.id)} /></View>
        {confirmMomentId === moment.id && <View style={s.deleteConfirm}><Text style={ui.subtitle}>متأكد من حذف اللحظة؟</Text><View style={ui.row}><Button label="إلغاء" secondary onPress={() => setConfirmMomentId(null)} /><Button label="نعم، احذف" onPress={async () => { try { await deleteMoment(moment.id); setConfirmMomentId(null); } catch { setPostError('تعذّر حذف اللحظة.'); } }} /></View></View>}
      </View>)}</View> : tab === 'post' && ownPosts.length ? <View style={s.postGrid}>{ownPosts.map((post) => <View key={post.id} style={s.postCard}>
        <Photo uri={post.image} label={`منشور ${post.caption}`} style={s.postImage} />
        <View style={s.postBody}><Text numberOfLines={2} style={s.postCaption}>{post.caption}</Text>{!!post.note && <Text numberOfLines={1} style={ui.subtitle}>{post.note}</Text>}<View style={ui.row}><Ionicons name="heart-outline" size={17} color={c.accent} /><Text style={ui.subtitle}>{post.likes} إعجاب</Text></View><Button label="حذف المنشور" secondary icon="trash-outline" onPress={() => setConfirmPostId(post.id)} /></View>
        {confirmPostId === post.id && <View style={s.deleteConfirm}><Text style={ui.subtitle}>متأكد من حذف المنشور نهائيًا؟</Text><View style={ui.row}><Button label="إلغاء" secondary onPress={() => setConfirmPostId(null)} /><Button label="نعم، احذف" onPress={async () => { try { await deletePost(post.id); setConfirmPostId(null); } catch { setPostError('تعذّر حذف المنشور.'); } }} /></View></View>}
      </View>)}</View> : <View style={s.galleryEmpty}>
        <View style={s.emptyFrames} pointerEvents="none"><View style={[s.frame, { transform: [{ rotate: '-9deg' }] }]} /><View style={[s.frame, s.frontFrame]}><Ionicons name={tab === 'moment' ? 'camera-outline' : 'images-outline'} size={34} color="#B39377" /></View></View>
        <Empty illustration={require('../assets/mascot-blanket-coffee.png')} title={tab === 'moment' ? 'أول لحظة، بداية حكاية' : 'للقطات اللي تستاهل تبقى'}
          text={isCafe ? (cafeLive ? (tab === 'post' ? 'أنشئ أول منشور لمتجرك؛ سيظهر هنا وفي الرئيسية مباشرة.' : 'أضف أصناف المنيو لتظهر لزوار متجرك.') : 'بعد تفعيل الاشتراك من لوحة الإدارة ستتمكن من تجهيز منيو متجرك والظهور في الاستكشاف.') : tab === 'moment' ? 'أنشئ أول لحظة من رابط صورة؛ ستختفي بعد انتهاء مدتها.' : isPlus ? 'أنشئ أول منشور دائم؛ سيظهر هنا وفي الرئيسية مباشرة.' : 'المنشورات الدائمة متاحة مع LilShot Plus.'}
          action={isCafe ? undefined : tab === 'moment' ? undefined : 'تعرّف على Plus'} onAction={onPlus} />
      </View>}
      {!!postError && <Text accessibilityRole="alert" style={{ color: c.danger, textAlign: 'center' }}>{postError}</Text>}
    </FadeInView>
  </ScrollView>
  </View>;
}

function ProfileSettings({ onClose }) {
  const { locale, setLocale, t } = useLanguage();
  const { user, signOut, authError } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { blockedProfiles, loading: blocksLoading, unblock } = useBlocking();
  const [name, setName] = useState(profile?.displayName || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [privacy, setPrivacy] = useState(profile?.privacy || 'public');
  const [saved, setSaved] = useState(() => ({ name: profile?.displayName || '', bio: profile?.bio || '', privacy: profile?.privacy || 'public' }));
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [confirmClose, setConfirmClose] = useState(false);
  const [blockedBusyId, setBlockedBusyId] = useState('');
  const [blockingMessage, setBlockingMessage] = useState('');
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
      <Text accessibilityRole="header" style={ui.heading}>{t('settings')}</Text>
      <Button label="رجوع" secondary disabled={busy} icon="arrow-forward" onPress={close} />
    </View>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.settingsContent}>
    <View style={ui.panel}>
      <Text style={ui.heading}>{t('language')}</Text>
      <View style={s.privacyOptions}>{[['ar', t('arabic')], ['en', t('english')]].map(([value, label]) => <PressableScale key={value} onPress={() => setLocale(value)} accessibilityRole="button" accessibilityState={{ selected: locale === value }} style={[s.privacyOption, locale === value && s.privacySelected]}><Text style={{ color: locale === value ? c.onPhoto : c.text, fontWeight: '700' }}>{label}</Text></PressableScale>)}</View>
      <Text style={ui.subtitle}>{t('appLanguageHint')}</Text>
    </View>
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
        <PressableScale key={value} disabled={busy} accessibilityRole="button" accessibilityLabel={`حساب ${label}`} accessibilityState={{ selected: privacy === value, disabled: busy }} onPress={() => change(setPrivacy, value)} style={[s.privacyOption, privacy === value && s.privacySelected]}>
          <Ionicons name={icon} size={18} color={privacy === value ? c.onPhoto : c.muted} /><Text style={{ color: privacy === value ? c.onPhoto : c.text }}>{label}</Text>
        </PressableScale>)}</View>
      <Text style={ui.subtitle}>{privacy === 'private' ? 'ملفك الشخصي خاص حالياً. مشاركة الملف مع المتابعين ستتوفر عند تفعيل المتابعة.' : 'يمكن للمستخدمين المسجّلين الاطلاع على ملفك العام.'}</Text>
      <Text style={s.bio}>طلبات المتابعة ستتوفر في مرحلة لاحقة.</Text>
    </View>
    <View style={ui.panel}>
      <Text style={ui.heading}>الحسابات المحظورة</Text>
      <Text style={ui.subtitle}>يمكنك فك الحظر من هنا. لن تعود المتابعة تلقائيًا بعد فك الحظر.</Text>
      {blocksLoading && <Text style={ui.subtitle}>جارٍ تحميل القائمة…</Text>}
      {!blocksLoading && !blockedProfiles.length && <Text style={s.bio}>لا توجد حسابات محظورة.</Text>}
      {blockedProfiles.map((blockedProfile) => <View key={blockedProfile.uid} style={s.blockedRow}>
        <View style={s.blockedIdentity}>{blockedProfile.photoURL ? <Photo uri={blockedProfile.photoURL} style={s.blockedAvatar} /> : <View style={s.blockedAvatar}><Ionicons name={blockedProfile.accountType === 'cafe' ? 'storefront-outline' : 'person-outline'} size={20} color={c.accent} /></View>}<View style={{ flex: 1 }}><Text style={s.blockedName}>{blockedProfile.displayName}</Text><Text style={s.blockedUsername}>@{blockedProfile.username}</Text></View></View>
        <Button label={blockedBusyId === blockedProfile.uid ? 'جارٍ الفك…' : 'فك الحظر'} secondary disabled={!!blockedBusyId} onPress={async () => {
          setBlockedBusyId(blockedProfile.uid); setBlockingMessage('');
          try { await unblock(blockedProfile.uid); setBlockingMessage(`تم فك حظر ${blockedProfile.displayName}.`); }
          catch (error) { setBlockingMessage(blockingErrorMessage(error)); }
          finally { setBlockedBusyId(''); }
        }} />
      </View>)}
      {!!blockingMessage && <Text accessibilityRole="alert" style={[ui.subtitle, { color: blockingMessage.startsWith('تم ') ? c.accent : c.danger }]}>{blockingMessage}</Text>}
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
  settingsHeader: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: 18, backgroundColor: 'rgba(242,242,247,.94)', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: c.line },
  settingsContent: { padding: 18, paddingTop: 16, paddingBottom: 140, gap: 16 },
  fieldLabel: { color: c.text, fontSize: 13, fontWeight: '600', textAlign: 'right' },
  field: { minHeight: 52, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: c.line, backgroundColor: c.raised, color: c.text, fontSize: 15, textAlign: 'right', writingDirection: 'rtl' },
  bioField: { minHeight: 105, textAlignVertical: 'top' },
  counter: { color: c.muted, fontSize: 11, textAlign: 'left' },
  privacyOptions: { flexDirection: 'row-reverse', gap: 10 },
  privacyOption: { flex: 1, minHeight: 48, borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: c.line, flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: c.raised },
  privacySelected: { backgroundColor: c.dark, borderColor: c.dark },
  blockedRow: { gap: 10, borderTopWidth: 1, borderColor: c.line, paddingTop: 13 },
  blockedIdentity: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
  blockedAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: c.cream, alignItems: 'center', justifyContent: 'center' },
  blockedName: { color: c.text, fontSize: 14, fontWeight: '700', textAlign: 'right' },
  blockedUsername: { color: c.accent, fontSize: 10, textAlign: 'right', writingDirection: 'ltr' },
  content: { paddingBottom: 136 },
  cover: { height: 260, margin: 12, marginBottom: 0, borderRadius: 28, overflow: 'hidden', backgroundColor: c.raised, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.12, shadowRadius: 24, elevation: 4 },
  coverTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15 },
  coverLogo: { color: c.onPhoto, fontSize: 22, fontWeight: '700', letterSpacing: -1 },
  body: { marginHorizontal: 12, paddingHorizontal: 18, paddingTop: 54, paddingBottom: 22, marginTop: -52, borderRadius: 28, backgroundColor: c.surface, alignItems: 'center', gap: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: c.line },
  avatar: { position: 'absolute', top: -48, width: 96, height: 96, borderRadius: 48, backgroundColor: c.cream, borderWidth: 4, borderColor: c.surface, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 3 },
  avatarPhoto: { width: 84, height: 84, borderRadius: 42 },
  initial: { color: c.accent, fontSize: 37, fontWeight: '600' },
  name: { color: c.text, fontSize: 30, fontWeight: '800', textAlign: 'center', marginTop: 2, letterSpacing: -0.5 },
  nameRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 2 },
  verified: { width: 19, height: 19, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2C9DEB' },
  username: { color: c.accent, fontSize: 12, writingDirection: 'ltr' },
  bio: { color: c.muted, fontSize: 13, lineHeight: 21, textAlign: 'center' },
  status: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7, backgroundColor: c.raised, borderRadius: 15 },
  statusDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: c.accent },
  statusText: { color: c.accent, fontSize: 10 },
  pendingStatus: { backgroundColor: '#FBF1E1' },
  pendingDot: { backgroundColor: '#C17C43' },
  stats: { flexDirection: 'row-reverse', alignSelf: 'stretch', marginTop: 10, paddingVertical: 15, borderRadius: 18, backgroundColor: c.raised, borderWidth: StyleSheet.hairlineWidth, borderColor: c.line },
  stat: { flex: 1, alignItems: 'center', gap: 5 },
  statDivider: { borderRightWidth: StyleSheet.hairlineWidth, borderColor: c.line },
  statValue: { color: c.text, fontSize: 24, fontWeight: '700' },
  statLabel: { color: c.muted, fontSize: 10 },
  waiting: { color: c.muted, fontSize: 10, textAlign: 'center', marginBottom: 6 },
  actions: { alignSelf: 'stretch', flexDirection: 'row-reverse', gap: 10 },
  plus: { alignSelf: 'stretch', flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: c.cream, borderRadius: 20, padding: 17, gap: 13, marginVertical: 6, borderWidth: StyleSheet.hairlineWidth, borderColor: '#E7D2B5' },
  plusIcon: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#FAF5EC', alignItems: 'center', justifyContent: 'center' },
  plusName: { color: c.dark, fontSize: 18, fontWeight: '700', textAlign: 'right' },
  plusTag: { color: c.accent, fontSize: 11, textAlign: 'right' },
  plusActive: { borderWidth: 1, borderColor: '#E4CDAF' },
  cafeCard: { alignSelf: 'stretch', borderRadius: 20, padding: 17, backgroundColor: c.dark, gap: 12, marginVertical: 6 },
  cafePendingCard: { backgroundColor: '#A66D40' },
  cafeCardTop: { flexDirection: 'row-reverse', alignItems: 'center', gap: 12 },
  cafeIcon: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,.18)' },
  cafeCardTitle: { color: c.onPhoto, fontSize: 17, fontWeight: '700', textAlign: 'right' },
  cafeCardText: { color: 'rgba(255,255,255,.78)', fontSize: 11, lineHeight: 18, textAlign: 'right', marginTop: 4 },
  tabs: { flexDirection: 'row-reverse', alignSelf: 'stretch', padding: 4, borderRadius: 14, backgroundColor: c.raised },
  tab: { flex: 1, minHeight: 44, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 11 },
  activeTab: { backgroundColor: c.surface, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 1 },
  tabText: { color: c.muted, fontSize: 12, fontWeight: '600' },
  galleryEmpty: { alignSelf: 'stretch', paddingTop: 30 },
  postGrid: { alignSelf: 'stretch', gap: 16, paddingTop: 18 },
  postCard: { overflow: 'hidden', borderRadius: 22, backgroundColor: c.dark, borderWidth: StyleSheet.hairlineWidth, borderColor: c.line },
  postImage: { width: '100%', height: 330 },
  postBody: { padding: 16, gap: 10 },
  postCaption: { color: c.onPhoto, fontSize: 16, fontWeight: '700', textAlign: 'right' },
  deleteConfirm: { padding: 16, borderTopWidth: 1, borderColor: c.line, backgroundColor: c.raised, gap: 12 },
  emptyFrames: { height: 120, width: 128, alignSelf: 'center' },
  frame: { position: 'absolute', left: 2, top: 0, width: 89, height: 112, borderRadius: 17, borderWidth: 1, borderColor: '#DCCDBC', backgroundColor: '#EEE5D9' },
  frontFrame: { left: 32, top: 8, backgroundColor: '#FBF7EF', transform: [{ rotate: '7deg' }], alignItems: 'center', justifyContent: 'center' },
});
