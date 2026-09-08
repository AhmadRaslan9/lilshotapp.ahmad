import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import { coffee as c } from '../../theme/coffee';
import { Button, IconButton, ui } from './Kit';
import { createReport } from '../../services/firebase/reports';
import { REPORT_REASONS, reportErrorMessage } from '../../services/firebase/reportModel';

export default function ReportButton({ targetType, targetId, targetOwnerUid, targetLabel, targetPreview = '', glass = false, label = 'تبليغ' }) {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  if (!user?.uid || !targetOwnerUid || user.uid === targetOwnerUid) return null;

  const submit = async () => {
    setBusy(true); setMessage('');
    try {
      await createReport(user, profile, { targetType, targetId, targetOwnerUid, targetLabel, targetPreview, reason, details });
      setMessage('تم إرسال البلاغ للأدمن للمراجعة.');
      setReason(''); setDetails('');
    } catch (error) { setMessage(reportErrorMessage(error)); }
    finally { setBusy(false); }
  };

  return <>
    <TouchableOpacity onPress={() => { setOpen(true); setMessage(''); }} accessibilityRole="button" accessibilityLabel={`${label} عن ${targetLabel || 'المحتوى'}`} style={[s.trigger, glass && s.glass]}>
      <Ionicons name="flag-outline" size={18} color={glass ? c.onPhoto : c.accent} />
      {!!label && <Text style={[s.triggerText, glass && { color: c.onPhoto }]}>{label}</Text>}
    </TouchableOpacity>
    <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
      <View style={s.overlay}><View style={s.sheet}>
        <View style={ui.between}><Text style={ui.heading}>إرسال بلاغ</Text><IconButton icon="close" label="إغلاق نافذة البلاغ" onPress={() => setOpen(false)} /></View>
        <Text style={ui.subtitle}>اختر السبب المناسب. سيصل البلاغ إلى لوحة الأدمن للمراجعة.</Text>
        <ScrollView contentContainerStyle={s.reasons}>{REPORT_REASONS.map((item) => <TouchableOpacity key={item.id} onPress={() => setReason(item.id)} style={[s.reason, reason === item.id && s.reasonActive]} accessibilityRole="radio" accessibilityState={{ checked: reason === item.id }}>
          <Ionicons name={reason === item.id ? 'radio-button-on' : 'radio-button-off'} size={20} color={c.accent} /><Text style={s.reasonText}>{item.label}</Text>
        </TouchableOpacity>)}</ScrollView>
        <TextInput value={details} onChangeText={setDetails} maxLength={300} multiline placeholder="تفاصيل إضافية (اختياري)" placeholderTextColor={c.muted} style={s.input} textAlign="right" />
        {!!message && <Text accessibilityRole="alert" style={[s.message, message.startsWith('تم ') && { color: c.accent }]}>{message}</Text>}
        <Button label={busy ? 'جارٍ الإرسال…' : 'إرسال البلاغ'} icon="flag-outline" disabled={busy || !reason || message.startsWith('تم ')} onPress={submit} />
      </View></View>
    </Modal>
  </>;
}

const s = StyleSheet.create({
  trigger: { minHeight: 40, paddingHorizontal: 12, borderRadius: 20, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 5, backgroundColor: c.raised, borderWidth: 1, borderColor: c.line },
  glass: { backgroundColor: 'rgba(255,255,255,.13)', borderColor: 'rgba(255,255,255,.16)' },
  triggerText: { color: c.accent, fontSize: 11, fontWeight: '600' },
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(25,18,15,.55)' },
  sheet: { maxHeight: '88%', padding: 22, paddingBottom: 34, gap: 16, borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: c.bg, borderWidth: 1, borderColor: c.line },
  reasons: { gap: 8 },
  reason: { minHeight: 52, paddingHorizontal: 15, borderRadius: 17, flexDirection: 'row-reverse', alignItems: 'center', gap: 9, backgroundColor: c.surface, borderWidth: 1, borderColor: c.line },
  reasonActive: { borderColor: c.accent, backgroundColor: c.cream },
  reasonText: { color: c.text, fontSize: 14, flex: 1, textAlign: 'right' },
  input: { minHeight: 92, padding: 14, borderRadius: 17, color: c.text, backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, textAlignVertical: 'top' },
  message: { color: c.danger, textAlign: 'center', lineHeight: 20 },
});
