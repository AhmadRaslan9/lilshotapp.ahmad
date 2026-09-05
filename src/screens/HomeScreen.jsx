import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, Feather } from '@expo/vector-icons';

const FILTERS = ['All', 'Groups', 'Personal', 'Work', 'Public'];

const STORIES = [
  {
    id: 's1',
    label: '12',
    faces: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    ],
  },
  {
    id: 's2',
    label: '37',
    faces: [
      'https://images.unsplash.com/photo-1495474472287-4c7edcad34c4?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop',
    ],
  },
  {
    id: 's3',
    label: '8',
    faces: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd722bf5d?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    ],
  },
];

const INITIAL_POSTS = [
  {
    id: 'p1',
    handle: 'Maria Theodor',
    time: '6h ago',
    caption: 'Check out my pillow fight with beautiful views',
    image:
      'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1200',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    liked: false,
  },
  {
    id: 'p2',
    handle: 'omar.shots',
    time: '1d ago',
    caption: 'Single origin pour-over, first light in the shop.',
    image:
      'https://images.unsplash.com/photo-1495474472287-4c7edcad34c4?q=80&w=1200',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    liked: true,
  },
];

export default function HomeScreen() {
  const [filter, setFilter] = useState('All');
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [drafts, setDrafts] = useState({});

  const toggleLike = (id) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, liked: !p.liked } : p))
    );
  };

  return (
    <View style={styles.page}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn}>
          <Feather name="search" size={18} color="#FFF8F2" />
        </TouchableOpacity>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Feed</Text>
          <Feather name="chevron-down" size={16} color="#FFF8F2" />
        </View>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="notifications-outline" size={18} color="#FFF8F2" />
          <View style={styles.bellDot}>
            <Text style={styles.bellN}>6</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity key={f} onPress={() => setFilter(f)}>
            <Text style={[styles.filter, filter === f && styles.filterOn]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.feed}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.stories}
        >
          {STORIES.map((s) => (
            <View key={s.id} style={styles.storyWrap}>
              <View style={styles.storyRing}>
                {s.faces.map((uri, i) => (
                  <Image
                    key={uri}
                    source={{ uri }}
                    style={[styles.storyFace, i === 1 && { marginLeft: -10 }]}
                    contentFit="cover"
                  />
                ))}
              </View>
              <View style={styles.storyBadge}>
                <Text style={styles.storyBadgeText}>{s.label}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {posts.map((post) => (
          <View key={post.id} style={styles.card}>
            <Image source={{ uri: post.image }} style={styles.cardImage} contentFit="cover" />
            <View style={styles.cardOverlay}>
              <View style={styles.authorRow}>
                <Image source={{ uri: post.avatar }} style={styles.authorAv} contentFit="cover" />
                <View>
                  <Text style={styles.authorName}>@{post.handle}</Text>
                  <Text style={styles.authorTime}>{post.time}</Text>
                </View>
              </View>
              <Text style={styles.caption}>{post.caption}</Text>
            </View>
            <View style={styles.commentBar}>
              <TextInput
                style={styles.commentInput}
                placeholder="Add comment"
                placeholderTextColor="rgba(255,248,242,0.55)"
                value={drafts[post.id] || ''}
                onChangeText={(t) => setDrafts((d) => ({ ...d, [post.id]: t }))}
              />
              <TouchableOpacity onPress={() => toggleLike(post.id)} hitSlop={8}>
                <Ionicons
                  name={post.liked ? 'heart' : 'heart-outline'}
                  size={22}
                  color={post.liked ? '#FF5A5A' : '#FFF8F2'}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#120E0C' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#241C16',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  title: { color: '#FFF8F2', fontSize: 18, fontWeight: '700' },
  bellDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#E23D3D',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  bellN: { color: '#fff', fontSize: 9, fontWeight: '800' },
  filters: { paddingHorizontal: 18, gap: 18, paddingBottom: 8 },
  filter: { color: '#6B5E54', fontSize: 14, fontWeight: '600' },
  filterOn: { color: '#FFF8F2' },
  feed: { paddingHorizontal: 16, paddingBottom: 120 },
  stories: { gap: 14, paddingVertical: 12 },
  storyWrap: { width: 72, height: 52 },
  storyRing: {
    width: 72,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#C97A3F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#241C16',
  },
  storyFace: { width: 36, height: 36, borderRadius: 18, marginLeft: -8 },
  storyBadge: {
    position: 'absolute',
    top: -4,
    right: -2,
    backgroundColor: '#E23D3D',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  storyBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  card: {
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#1C1612',
    marginBottom: 18,
    minHeight: 420,
  },
  cardImage: { ...StyleSheet.absoluteFillObject },
  cardOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 18,
    paddingBottom: 70,
    backgroundColor: 'rgba(0,0,0,0.18)',
    minHeight: 360,
  },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  authorAv: { width: 28, height: 28, borderRadius: 14 },
  authorName: { color: '#FFF8F2', fontSize: 13, fontWeight: '700' },
  authorTime: { color: 'rgba(255,248,242,0.65)', fontSize: 11 },
  caption: { color: '#FFF8F2', fontSize: 22, fontWeight: '800', lineHeight: 28 },
  commentBar: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 14,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(20,16,12,0.55)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
  },
  commentInput: { flex: 1, color: '#FFF8F2', fontSize: 14 },
});