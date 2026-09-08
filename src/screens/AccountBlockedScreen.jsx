import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/coffee/Kit';
import { coffee as c } from '../theme/coffee';

export default function AccountBlockedScreen() {
  const { signOut } = useAuth();
  const [busy, setBusy] = useState(false);

  return <View style={s.page}>
    <View style={s.icon}><Ionicons name="shield-outline" size={42} color={c.accent} /></View>
    <Text style={s.title}>تم إيقاف الحساب</Text>
    <Text style={s.text}>لا يمكنك استخدام LilShot حالياً. إذا كان هذا الإجراء بالخطأ، تواصل مع إدارة التطبيق.</Text>
    <Button label={busy ? 'جارٍ تسجيل الخروج…' : 'تسجيل الخروج'} secondary icon="log-out-outline" disabled={busy} onPress={async () => {
      setBusy(true);
      try { await signOut(); } finally { setBusy(false); }
    }} />
  </View>;
}

const s = StyleSheet.create({
  page: { flex: 1, padding: 28, alignItems: 'center', justifyContent: 'center', gap: 18, backgroundColor: c.bg },
  icon: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: c.cream },
  title: { color: c.text, fontSize: 28, fontWeight: '800', textAlign: 'center' },
  text: { maxWidth: 330, color: c.muted, lineHeight: 24, textAlign: 'center' },
});
