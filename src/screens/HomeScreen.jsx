import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { coffee as c } from '../theme/coffee';
import { previewShots, previewCafes, visibleShots, remainingLabel } from '../data/coffeePreview';
import { useCoffeePreview } from '../context/CoffeePreviewContext';
import { Photo, Pill, IconButton, DemoNote, Empty, ui } from '../components/coffee/Kit';

export default function HomeScreen({ onCamera, onCafe, onNotifications }) {
  const [filter, setFilter] = useState('all');
  const [author, setAuthor] = useState(null);
  const [now, setNow] = useState(Date.now());
  const { liked, toggleLiked } = useCoffeePreview();
  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(tick);
  }, []);
  const shots = visibleShots(previewShots, filter, author, now);

  return <ScrollView style={ui.page} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
    <View style={ui.between}>
      <IconButton icon="camera-outline" label="صوّر لحظتك" onPress={onCamera} />
      <Text style={s.brand}>lilshot<Text style={{ color: c.accent }}>.</Text></Text>
      <IconButton icon="notifications-outline" label="الإشعارات" onPress={onNotifications} />
    </View>
    <View style={s.intro}><Text style={s.title}>يومك يستاهل لقطة.</Text><Text style={ui.subtitle}>قهوة، وأصحاب، ولحظات حلوة.</Text></View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.stories}>
      <TouchableOpacity style={s.story} onPress={onCamera} accessibilityRole="button" accessibilityLabel="أضف لحظة">
        <View style={s.addStory}><Ionicons name="add" size={28} color={c.accent} /></View><Text style={s.storyName}>لحظتك</Text>
      </TouchableOpacity>
      {previewShots.map(shot => <TouchableOpacity key={shot.id} style={s.story}
        accessibilityRole="button" accessibilityLabel={`لقطات ${shot.author}`}
        accessibilityState={{ selected: author === shot.handle }}
        onPress={() => { setAuthor(author === shot.handle ? null : shot.handle); setFilter('all'); }}>
        <View style={[s.storyRing, author === shot.handle && s.selectedStory]}><Photo uri={shot.image} style={s.storyPhoto} /></View>
        <Text style={[s.storyName, author === shot.handle && { color: c.accent }]}>{shot.author}</Text>
      </TouchableOpacity>)}
    </ScrollView>
    <View style={ui.between}><View style={[ui.row, { gap: 7 }]}>
      {[['all', 'لك'], ['moment', 'اللحظات'], ['post', 'البوستات']].map(([id, label]) =>
        <Pill key={id} label={label} active={filter === id} onPress={() => setFilter(id)} />)}
    </View></View>
    <DemoNote>معاينة التصميم · اللقطات والإعجابات تجريبية</DemoNote>
    {author && <Pill label="عرض الجميع ×" onPress={() => setAuthor(null)} />}
    {shots.map(shot => {
      const cafe = previewCafes.find(x => x.id === shot.cafeId);
      const isLiked = liked.includes(shot.id);
      const post = shot.kind === 'post';
      return <View key={shot.id} style={[s.card, post && s.postCard]}>
        <Photo uri={shot.image} label={`قهوة ${shot.author}`} style={StyleSheet.absoluteFill} />
        <LinearGradient colors={['rgba(34,23,17,0.12)', 'transparent', 'rgba(34,23,17,0.5)']} locations={[0, 0.4, 1]} style={StyleSheet.absoluteFill} />
        <View style={[ui.between, { alignItems: 'flex-start' }]}>
          <BlurView intensity={35} tint="dark" style={s.authorGlass}>
            <View style={s.avatar}><Text style={s.initial}>{shot.initial}</Text></View>
            <View><View style={[ui.row, { gap: 4 }]}><Text style={s.author}>{shot.author}</Text>
              {shot.plus && <Ionicons name="checkmark-circle" size={14} color="#B6DCED" accessibilityLabel="مشترك Plus" />}
            </View><Text style={s.handle}>@{shot.handle}</Text></View>
          </BlurView>
          <View style={[s.type, post && s.postType]}>
            <Ionicons name={post ? 'grid-outline' : 'time-outline'} size={13} color={post ? c.dark : c.onPhoto} />
            <Text style={[s.typeText, post && { color: c.dark }]}>{post ? 'بوست' : remainingLabel(shot.expiresAt, now)}</Text>
          </View>
        </View>
        <BlurView intensity={40} tint="dark" style={s.cardBottom}>
          <Text style={s.caption}>{shot.caption}</Text>
          <Text style={s.note}>{shot.note}</Text>
          <View style={ui.between}>
            <TouchableOpacity onPress={() => onCafe(cafe)} style={s.location} accessibilityRole="button" accessibilityLabel={`زيارة ${cafe.name}`}>
              <Ionicons name="location-outline" size={15} color={c.onPhoto} /><Text style={s.locationText}>{cafe.name} · {cafe.city}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleLiked(shot.id)} accessibilityRole="button"
              accessibilityLabel={`إعجاب بلقطة ${shot.author}`} accessibilityState={{ selected: isLiked }} style={s.like}>
              <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={22} color={isLiked ? '#FFB5AB' : c.onPhoto} />
              <Text style={s.likes}>{shot.likes + (isLiked ? 1 : 0)}</Text>
            </TouchableOpacity>
          </View>
          {!post && <View style={s.track}><View style={[s.progress, { width: `${Math.max(0, Math.min(100, (shot.expiresAt - now) / (shot.durationHours * 3600000) * 100))}%` }]} /></View>}
        </BlurView>
      </View>;
    })}
    {!shots.length && <Empty title="ما في لقطات بهالقسم" text="جرّب قسم ثاني أو ارجع لعرض الجميع." />}
  </ScrollView>;
}

const s = StyleSheet.create({
  content: { padding: 18, paddingBottom: 144, gap: 18 },
  brand: { color: c.text, fontSize: 29, fontWeight: '800', letterSpacing: -1.4 },
  intro: { gap: 2, marginTop: 4 },
  title: { color: c.text, fontSize: 24, lineHeight: 37, fontWeight: '700', textAlign: 'right' },
  stories: { flexDirection: 'row-reverse', gap: 20, flexGrow: 1, justifyContent: 'flex-start', paddingVertical: 4 },
  story: { alignItems: 'center', gap: 7 },
  storyRing: { width: 66, height: 66, borderRadius: 33, borderWidth: 1.5, borderColor: '#C5A17D', padding: 4 },
  selectedStory: { borderColor: c.dark, backgroundColor: c.cream },
  storyPhoto: { width: '100%', height: '100%', borderRadius: 30 },
  addStory: { width: 66, height: 66, borderRadius: 33, borderWidth: 1, borderStyle: 'dashed', borderColor: '#C5A17D', backgroundColor: c.raised, alignItems: 'center', justifyContent: 'center' },
  storyName: { color: c.muted, fontSize: 11 },
  card: { minHeight: 438, borderRadius: 30, overflow: 'hidden', padding: 12, justifyContent: 'space-between', backgroundColor: c.raised },
  postCard: { borderRadius: 20, borderWidth: 2, borderColor: '#CEB595' },
  authorGlass: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8, borderRadius: 25, padding: 7, paddingLeft: 12, overflow: 'hidden', backgroundColor: 'rgba(50,37,32,0.4)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  avatar: { width: 33, height: 33, borderRadius: 17, backgroundColor: c.cream, alignItems: 'center', justifyContent: 'center' },
  initial: { color: c.dark, fontWeight: '700' },
  author: { color: c.onPhoto, fontSize: 13, fontWeight: '700' },
  handle: { color: '#F0E5DD', fontSize: 9, textAlign: 'right', marginTop: 2 },
  type: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: c.glass, flexDirection: 'row-reverse', alignItems: 'center', gap: 4, marginTop: 5 },
  postType: { backgroundColor: c.cream },
  typeText: { color: c.onPhoto, fontSize: 10, fontWeight: '600' },
  cardBottom: { gap: 8, padding: 16, borderRadius: 23, overflow: 'hidden', backgroundColor: 'rgba(41,29,23,0.55)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', marginTop: 120 },
  caption: { color: c.onPhoto, fontSize: 24, lineHeight: 36, fontWeight: '600', textAlign: 'right' },
  note: { color: '#ECDFD3', fontSize: 12, textAlign: 'right', lineHeight: 20 },
  location: { flexDirection: 'row-reverse', gap: 4, alignItems: 'center', minHeight: 44, flexShrink: 1 },
  locationText: { color: c.onPhoto, fontSize: 11, flexShrink: 1 },
  like: { minWidth: 63, minHeight: 44, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.13)' },
  likes: { color: c.onPhoto, fontSize: 12 },
  track: { height: 2, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'flex-end', overflow: 'hidden' },
  progress: { height: 2, backgroundColor: '#E9C9A1' },
});
