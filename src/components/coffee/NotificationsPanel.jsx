import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { markAllNotificationsRead, markNotificationRead, subscribeToNotifications } from '../../services/firebase/notifications';
import { notificationIcon, notificationText } from '../../services/firebase/notificationModel';
import { Button, Empty, ui } from './Kit';
import { coffee as c } from '../../theme/coffee';

export default function NotificationsPanel() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const unread = useMemo(() => items.filter((item) => !item.read).length, [items]);
  useEffect(() => {
    if (!user?.uid || user.uid === 'demo-local') { setLoading(false); return undefined; }
    return subscribeToNotifications(user.uid, (value) => { setItems(value); setLoading(false); setError(''); }, () => { setLoading(false); setError('تعذّر تحميل الإشعارات الآن.'); });
  }, [user?.uid]);
  if (loading) return <ActivityIndicator size="large" color={c.accent} accessibilityLabel="جارٍ تحميل الإشعارات" />;
  if (!items.length) return <Empty icon="notifications-outline" title="كل شيء هادي هنا" text="إشعارات المتابعة والإعجاب الجديدة ستظهر هنا." />;
  return <View style={s.wrap}>
    <View style={ui.between}><Text style={ui.subtitle}>{unread} غير مقروء</Text><Button label={busy ? 'جارٍ التحديث…' : 'تعليم الكل كمقروء'} secondary disabled={!unread || busy} onPress={async () => { setBusy(true); setError(''); try { await markAllNotificationsRead(user.uid, items); } catch { setError('تعذّر تحديث الإشعارات.'); } finally { setBusy(false); } }} /></View>
    {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
    {items.map((item) => <TouchableOpacity key={item.id} disabled={item.read} accessibilityRole="button" accessibilityLabel={notificationText(item)} accessibilityState={{ disabled: item.read }} onPress={async () => { try { await markNotificationRead(user.uid, item.id); } catch { setError('تعذّر تعليم الإشعار كمقروء.'); } }} style={[s.item, !item.read && s.unread]}>
      <View style={s.icon}><Ionicons name={notificationIcon(item.type)} size={20} color={item.type === 'like' ? '#B34F52' : c.accent} /></View>
      <View style={{ flex: 1, gap: 4 }}><Text style={s.text}>{notificationText(item)}</Text><Text style={s.handle}>@{item.actorUsername || 'lilshot'}</Text>{item.createdAtMs > 0 && <Text style={s.time}>{new Date(item.createdAtMs).toLocaleString('ar')}</Text>}</View>
      {!item.read && <View accessibilityLabel="غير مقروء" style={s.dot} />}
    </TouchableOpacity>)}
  </View>;
}

const s = StyleSheet.create({
  wrap: { gap: 12 },
  item: { minHeight: 82, borderRadius: 21, padding: 14, flexDirection: 'row-reverse', alignItems: 'center', gap: 12, backgroundColor: c.surface, borderWidth: 1, borderColor: c.line },
  unread: { backgroundColor: c.raised, borderColor: '#D9B995' },
  icon: { width: 43, height: 43, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: c.cream },
  text: { color: c.text, fontSize: 14, fontWeight: '700', textAlign: 'right' },
  handle: { color: c.accent, fontSize: 10, textAlign: 'right', writingDirection: 'ltr' },
  time: { color: c.muted, fontSize: 9, textAlign: 'right' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: c.accent },
  error: { color: c.danger, textAlign: 'center' },
});
