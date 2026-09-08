import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { likeErrorMessage, likePost, subscribeToPostLike, unlikePost } from '../../services/firebase/postLikes';
import { coffee as c } from '../../theme/coffee';

export default function PostLikeButton({ postId, count = 0, onError }) {
  const { user, isFirebaseConfigured } = useAuth();
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const enabled = Boolean(isFirebaseConfigured && user?.uid && user.uid !== 'demo-local');
  useEffect(() => {
    if (!enabled) { setLoading(false); return undefined; }
    return subscribeToPostLike(postId, user.uid, (value) => { setLiked(value); setLoading(false); }, (error) => { setLoading(false); onError?.(likeErrorMessage(error)); });
  }, [enabled, onError, postId, user?.uid]);
  const toggle = async () => {
    if (!enabled || loading || busy) return;
    setBusy(true); onError?.('');
    try {
      if (liked) await unlikePost(postId, user.uid);
      else await likePost(postId, user.uid);
    } catch (error) { onError?.(likeErrorMessage(error)); }
    finally { setBusy(false); }
  };
  return <TouchableOpacity onPress={toggle} disabled={!enabled || loading || busy} accessibilityRole="button"
    accessibilityLabel={liked ? 'إلغاء الإعجاب' : 'إعجاب بالمنشور'} accessibilityState={{ selected: liked, disabled: !enabled || loading || busy, busy }} style={[s.like, (!enabled || loading || busy) && { opacity: 0.7 }]}>
    <Ionicons name={liked ? 'heart' : 'heart-outline'} size={22} color={liked ? '#FFB5AB' : c.onPhoto} />
    <Text style={s.count}>{Math.max(0, Number(count) || 0)}</Text>
  </TouchableOpacity>;
}

const s = StyleSheet.create({
  like: { minWidth: 63, minHeight: 44, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.13)' },
  count: { color: c.onPhoto, fontSize: 12 },
});
