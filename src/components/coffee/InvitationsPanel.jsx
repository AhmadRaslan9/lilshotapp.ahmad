import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Button, ui } from './Kit';
import { ensureAccountInvites, subscribeToInvites } from '../../services/firebase/invitations';
import { inviteStatusLabel } from '../../services/firebase/invitationModel';
import { coffee as c } from '../../theme/coffee';

export default function InvitationsPanel() {
  const { user } = useAuth();
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  useEffect(() => { if (!user?.uid || user.uid === 'demo-local') { setLoading(false); return undefined; } return subscribeToInvites(user.uid, (value) => { setItems(value); setLoading(false); }, () => { setError('تعذّر تحميل الدعوات. انشر قواعد Firestore الجديدة.'); setLoading(false); }); }, [user?.uid]);
  if (loading) return <ActivityIndicator color={c.accent} />;
  return <View style={s.wrap}><Text style={ui.heading}>دعواتك</Text><Text style={ui.subtitle}>لك ثلاث دعوات خاصة. شارك الرمز مع الأشخاص الذين تريد دعوتهم إلى LilShot.</Text>
    {!items.length ? <Button label={busy ? 'جارٍ الإنشاء…' : 'إنشاء دعواتي الثلاث'} disabled={busy} icon="ticket-outline" onPress={async () => { setBusy(true); setError(''); try { await ensureAccountInvites(user.uid); } catch { setError('تعذّر إنشاء الدعوات. تأكد من نشر القواعد الجديدة.'); } finally { setBusy(false); } }} /> : items.map((item) => <View key={item.id} style={s.invite}><View><Text selectable style={s.code}>{item.code}</Text><Text style={s.status}>{inviteStatusLabel(item.status)}</Text></View><Text style={s.slot}>#{item.slot}</Text></View>)}
    {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
  </View>;
}
const s = StyleSheet.create({ wrap: { gap: 12 }, invite: { minHeight: 62, padding: 14, borderRadius: 18, backgroundColor: c.raised, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' }, code: { color: c.text, fontSize: 15, fontWeight: '900', letterSpacing: 1.2, writingDirection: 'ltr' }, status: { color: c.green, fontSize: 10, marginTop: 5 }, slot: { color: c.accent, fontWeight: '900' }, error: { color: c.danger, textAlign: 'right' } });
