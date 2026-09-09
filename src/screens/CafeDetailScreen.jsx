import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Linking, View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { coffee as c } from '../theme/coffee';
import { ui, Photo, IconButton, Pill, Button, DemoNote, Empty } from '../components/coffee/Kit';
import { coffeePhotos } from '../data/coffeePreview';
import { useCoffeePreview } from '../context/CoffeePreviewContext';
import { MENU_CATEGORIES } from '../services/firebase/menuModel';
import { subscribeToCafeMenu } from '../services/firebase/menu';
import { subscribeToStoreDetails } from '../services/firebase/stores';
import { formatPrice, STORE_DAYS } from '../services/firebase/storeModel';
import { useAuth } from '../context/AuthContext';
import { followProfile, subscribeToFollowersCount, subscribeToFollowState, unfollowProfile } from '../services/firebase/relationships';
import { relationshipErrorMessage } from '../services/firebase/relationshipModel';
import ReportButton from '../components/coffee/ReportButton';
import { useBlocking } from '../context/BlockingContext';
import { blockingErrorMessage } from '../services/firebase/blocking';
export default function CafeDetailScreen({ cafe, onClose }) {
  const [tab, setTab] = useState('المنيو');
  const [menu, setMenu] = useState(cafe.isLive ? [] : (cafe.menu || []));
  const [menuLoading, setMenuLoading] = useState(Boolean(cafe.isLive));
  const [menuError, setMenuError] = useState('');
  const [details, setDetails] = useState(cafe);
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(Boolean(cafe.isLive));
  const [followBusy, setFollowBusy] = useState(false);
  const [followError, setFollowError] = useState('');
  const [followersCount, setFollowersCount] = useState(Number(cafe.followersCount ?? cafe.followers ?? 0));
  const [confirmBlock, setConfirmBlock] = useState(false);
  const { user, isFirebaseConfigured } = useAuth();
  const { requested, toggleRequest } = useCoffeePreview();
  const { block, excludedIds } = useBlocking();
  const pending = requested.includes(cafe.id);
  const liveRelationship = cafe.isLive && isFirebaseConfigured && user?.uid && user.uid !== 'demo-local';
  const ownCafe = liveRelationship && user.uid === cafe.id;
  useEffect(() => { if (!ownCafe && cafe.isLive && excludedIds.has(cafe.id)) onClose(); }, [cafe.id, cafe.isLive, excludedIds, ownCafe]);
  useEffect(() => {
    if (!cafe.isLive) return undefined;
    setMenuLoading(true); setMenuError('');
    return subscribeToCafeMenu(cafe.id, (value) => { setMenu(value); setMenuLoading(false); }, () => {
      setMenuLoading(false); setMenuError('تعذّر تحميل المنيو الآن.');
    });
  }, [cafe.id, cafe.isLive]);
  useEffect(() => {
    if (!liveRelationship) { setFollowLoading(false); return undefined; }
    const stopState = subscribeToFollowState(user.uid, cafe.id, (value) => { setFollowing(value); setFollowLoading(false); }, (error) => { setFollowError(relationshipErrorMessage(error)); setFollowLoading(false); });
    const stopCount = subscribeToFollowersCount(cafe.id, setFollowersCount, () => {});
    return () => { stopState(); stopCount(); };
  }, [cafe.id, liveRelationship, user?.uid]);
  const toggleLiveFollow = async () => {
    if (!liveRelationship || ownCafe || followBusy) return;
    setFollowBusy(true); setFollowError('');
    try {
      if (following) await unfollowProfile(user.uid, cafe.id);
      else await followProfile(user.uid, cafe.id);
    } catch (error) { setFollowError(relationshipErrorMessage(error)); }
    finally { setFollowBusy(false); }
  };
  const confirmAndBlock = async () => {
    if (!liveRelationship || ownCafe || followBusy) return;
    setFollowBusy(true); setFollowError('');
    try {
      await block({ uid: cafe.id, displayName: cafe.name, username: cafe.username || '', photoURL: cafe.profilePhotoURL || '', accountType: 'cafe' });
      setConfirmBlock(false); onClose();
    } catch (error) { setFollowError(blockingErrorMessage(error)); }
    finally { setFollowBusy(false); }
  };
  useEffect(() => {
    if (!cafe.isLive) return undefined;
    return subscribeToStoreDetails(cafe.id, (value) => setDetails((old) => ({ ...old, ...(value || {}) })), () => {});
  }, [cafe.id, cafe.isLive]);
  const groupedMenu = useMemo(() => cafe.isLive ? MENU_CATEGORIES.map((category) => ({ category, items: menu.filter((item) => item.category === category) })).filter((group) => group.items.length) : [], [cafe.isLive, menu]);
  return <SafeAreaView style={ui.page}><ScrollView contentContainerStyle={{ paddingBottom: 36 }} showsVerticalScrollIndicator={false}>
    <View style={s.hero}><Photo uri={details.coverURL || cafe.image || require('../assets/CoffeeShop.png')} style={StyleSheet.absoluteFill} /><LinearGradient colors={['rgba(0,0,0,0.08)','rgba(0,0,0,0.18)','rgba(0,0,0,0.86)']} style={StyleSheet.absoluteFill} />
      <View style={[ui.between, { padding: 20 }]}><IconButton glass icon="arrow-forward" label="العودة للمقاهي" onPress={onClose} /></View>
      <View style={s.heroBottom}><Text style={[ui.eyebrow, { color: c.cream }]}>{cafe.latin}</Text><View style={s.nameRow}><Text style={s.name}>{cafe.name}</Text>{cafe.verified && <View style={s.verified}><Ionicons name="checkmark" size={12} color={c.onPhoto} /></View>}</View><Text style={s.heroLocation}>{[details.country || cafe.country, details.city || cafe.city, details.district || cafe.district].filter(Boolean).join(' · ')}</Text></View>
    </View>
    <View style={{ paddingHorizontal: 22, gap: 22 }}>{cafe.isLive ? <DemoNote>حساب مقهى حقيقي · المنيو يتحدّث مباشرة</DemoNote> : <DemoNote>حساب مقهى تجريبي · بيانات وأسعار توضيحية</DemoNote>}
      <View style={s.stats}>{[[cafe.rating,'التقييم'],[String(cafe.reviews),'تقييم'],[followersCount,'متابع']].map(([value,label]) => <View key={label} style={s.stat}><Text style={s.value}>{value}</Text><Text style={ui.subtitle}>{label}</Text></View>)}</View>
      {cafe.isLive ? <><Button label={ownCafe ? 'هذا متجرك' : followBusy ? 'جارٍ التحديث…' : following ? 'إلغاء المتابعة' : 'متابعة المقهى'} icon={following ? 'checkmark-circle-outline' : 'person-add-outline'} secondary={following || ownCafe} disabled={!liveRelationship || ownCafe || followLoading || followBusy} onPress={toggleLiveFollow} />{!ownCafe && <><ReportButton targetType="cafe" targetId={cafe.id} targetOwnerUid={cafe.id} targetLabel={cafe.name} targetPreview={details.description || cafe.description || ''} label="تبليغ عن المقهى" /><Button label="حظر المقهى" icon="ban-outline" secondary onPress={() => setConfirmBlock(true)} /></>}{confirmBlock && <View style={[ui.panel, { gap: 12 }]}><Text style={s.placeTitle}>حظر {cafe.name}؟</Text><Text style={ui.subtitle}>سيختفي المقهى ومنشوراته ولحظاته من حسابك، وستُلغى المتابعة بينكما.</Text><Button label={followBusy ? 'جارٍ الحظر…' : 'نعم، احظر المقهى'} icon="ban-outline" disabled={followBusy} onPress={confirmAndBlock} /><Button label="إلغاء" secondary disabled={followBusy} onPress={() => setConfirmBlock(false)} /></View>}{!!followError && <Text accessibilityRole="alert" style={s.error}>{followError}</Text>}</> : <><Button label={pending ? 'إلغاء طلب المتابعة' : 'طلب متابعة'} icon={pending ? 'time-outline' : 'add'} onPress={() => toggleRequest(cafe.id)} secondary={pending} /><Text style={[ui.subtitle,{ textAlign: 'center' }]}>{pending ? 'طلب تجريبي معلّق؛ لم يُرسل إلى متجر حقيقي.' : 'طلبات المتابعة تحتاج قبول صاحب الحساب.'}</Text></>}
      <Text style={ui.subtitle}>{details.description || cafe.description}</Text>
      <View style={ui.row}>{['المنيو','المكان','التقييم'].map(t => <Pill key={t} label={t} active={tab === t} onPress={() => setTab(t)} />)}</View>
      {tab === 'المنيو' && (menuLoading ? <ActivityIndicator color={c.accent} size="large" /> : menuError ? <Text style={s.error}>{menuError}</Text> : cafe.isLive ? (!menu.length ? <Empty illustration={require('../assets/mascot-breakfast-walk.png')} title="المنيو قيد التجهيز" text="صاحب المقهى لم يضف أصنافاً بعد." /> : groupedMenu.map((group) => <View key={group.category} style={ui.panel}><Text style={s.categoryTitle}>{group.category}</Text>{group.items.map((item, i) => <View key={item.id} style={[s.liveMenuRow, !item.available && s.unavailable, i === group.items.length - 1 && { borderBottomWidth: 0 }]}>{item.imageURL ? <Photo uri={item.imageURL} label={`صورة ${item.name}`} style={s.menuPhoto} /> : <View style={s.menuPhotoEmpty}><Ionicons name="cafe-outline" size={22} color={c.accent} /></View>}<View style={{ flex: 1, gap: 4 }}><View style={s.itemTitleRow}><Text style={s.menuName}>{item.name}</Text>{!item.available && <Text style={s.soldOut}>غير متوفر</Text>}</View>{!!item.description && <Text style={ui.subtitle}>{item.description}</Text>}<Text style={s.price}>{formatPrice(item.price, details.currency || cafe.currency)}</Text></View></View>)}</View>)) : <View style={ui.panel}><Text style={ui.eyebrow}>BREWED WITH CARE</Text>{menu.map((item,i) => <View key={item.name} style={[ui.between,s.menuRow,i === menu.length-1 && { borderBottomWidth: 0 }]}><View style={{ flex: 1, gap: 4 }}><Text style={s.menuName}>{item.name}</Text><Text style={ui.subtitle}>{item.note}</Text></View><Text style={s.price}>{formatPrice(item.price, cafe.currency)}</Text></View>)}</View>)}
      {tab === 'المكان' && (cafe.isLive ? <View style={{ gap: 15 }}><View style={ui.panel}><Text style={s.placeTitle}>العنوان</Text><Text style={ui.subtitle}>{details.address || 'لم يضف المقهى عنوانه بعد.'}</Text>{!!details.mapsURL && <Button label="فتح الموقع على الخريطة" secondary icon="map-outline" onPress={() => Linking.openURL(details.mapsURL)} />}</View><View style={ui.panel}><Text style={s.placeTitle}>أوقات العمل</Text>{STORE_DAYS.map(([key, label]) => <View key={key} style={ui.between}><Text style={s.dayValue}>{details.hours?.[key] || 'غير محدد'}</Text><Text style={s.dayLabel}>{label}</Text></View>)}</View></View> : <View style={{ gap: 15 }}><View style={{ flexDirection: 'row', gap: 10 }}><View style={{ flex: 1, gap: 10 }}><Photo uri={require('../assets/CoffeeShop.png')} style={{ height: 230, borderRadius: 20 }} /><Photo uri={coffeePhotos.cup} style={{ height: 130, borderRadius: 20 }} /></View><View style={{ flex: 1, gap: 10 }}><Photo uri={coffeePhotos.table} style={{ height: 130, borderRadius: 20 }} /><Photo uri={coffeePhotos.pour} style={{ height: 230, borderRadius: 20 }} /></View></View><Text style={ui.subtitle}>صور توضيحية للأجواء.</Text></View>)}
      {tab === 'التقييم' && <View style={[ui.panel,{ alignItems: 'center' }]}><Text style={[s.value,{ fontSize: 48 }]}>{cafe.rating}</Text><View style={ui.row}>{[1,2,3,4,5].map(n => <Ionicons key={n} name="star" color={c.accent} size={24} />)}</View><Text style={ui.subtitle}>{cafe.reviews} تقييم توضيحي</Text><Text style={[ui.subtitle,{ textAlign: 'center' }]}>التقييمات الحقيقية وإضافة تقييمك تتوفر عند إطلاق المقاهي.</Text></View>}
    </View>
  </ScrollView></SafeAreaView>;
}
const s = StyleSheet.create({ hero: { height: 390, margin: 10, borderRadius: 34, overflow: 'hidden', justifyContent: 'space-between' }, heroBottom: { padding: 24, alignItems: 'flex-end', gap: 7 }, heroLocation: { color: 'rgba(255,255,255,.8)', fontSize: 12, textAlign: 'right' }, nameRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 }, name: { color: c.onPhoto, fontSize: 46, fontWeight: '900' }, verified: { width: 21, height: 21, borderRadius: 11, backgroundColor: '#2C9DEB', alignItems: 'center', justifyContent: 'center' }, stats: { flexDirection: 'row-reverse', paddingVertical: 8 }, stat: { flex: 1, alignItems: 'center', gap: 6 }, value: { color: c.text, fontSize: 27, fontWeight: '600' }, menuRow: { paddingVertical: 14, borderBottomWidth: 1, borderColor: c.line }, liveMenuRow: { paddingVertical: 13, borderBottomWidth: 1, borderColor: c.line, flexDirection: 'row-reverse', alignItems: 'center', gap: 12 }, menuPhoto: { width: 68, height: 68, borderRadius: 17 }, menuPhotoEmpty: { width: 68, height: 68, borderRadius: 17, backgroundColor: c.cream, alignItems: 'center', justifyContent: 'center' }, categoryTitle: { color: c.text, fontSize: 18, fontWeight: '700', textAlign: 'right' }, itemTitleRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 }, menuName: { color: c.text, textAlign: 'right', fontSize: 16, fontWeight: '600', flexShrink: 1 }, price: { color: '#C87920', fontSize: 14, fontWeight: '800', textAlign: 'right' }, soldOut: { color: c.danger, fontSize: 9, backgroundColor: '#FCE9E8', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 9 }, unavailable: { opacity: 0.58 }, error: { color: c.danger, textAlign: 'center', padding: 20 }, placeTitle: { color: c.text, fontSize: 17, fontWeight: '700', textAlign: 'right' }, dayLabel: { color: c.text, fontSize: 12, fontWeight: '700' }, dayValue: { color: c.muted, fontSize: 12 }, });
