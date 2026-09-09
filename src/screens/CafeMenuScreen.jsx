import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '../context/ProfileContext';
import { Button, IconButton, Photo, Sheet, ui } from '../components/coffee/Kit';
import { MENU_CATEGORIES } from '../services/firebase/menuModel';
import { createMenuItem, removeMenuItem, subscribeToCafeMenu, updateMenuItem } from '../services/firebase/menu';
import { subscribeToStoreDetails } from '../services/firebase/stores';
import { formatPrice } from '../services/firebase/storeModel';
import { coffee as c } from '../theme/coffee';

const blankItem = { name: '', description: '', price: '', category: MENU_CATEGORIES[0], available: true, imageURL: '', sortOrder: 0 };
const messages = {
  'menu/invalid-name': 'اسم الصنف يجب أن يكون من حرفين إلى 60 حرفاً.',
  'menu/invalid-description': 'الوصف بحد أقصى 200 حرف.',
  'menu/invalid-price': 'اكتب سعراً صحيحاً بين 0 و10000.',
  'menu/invalid-image': 'رابط الصورة طويل جداً.',
  'permission-denied': 'لا يمكن تعديل المنيو قبل تفعيل اشتراك المقهى من الإدارة.',
};

export default function CafeMenuScreen({ onClose }) {
  const { profile } = useProfile();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(blankItem);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const canManage = profile?.accountType === 'cafe'
    && profile?.accountStatus === 'active'
    && ['cafe_basic', 'cafe_pro'].includes(profile?.plan);

  useEffect(() => {
    if (!profile?.uid) return undefined;
    if (!canManage) {
      setItems([]); setLoading(false); setLoadError('');
      return undefined;
    }
    setLoading(true); setLoadError('');
    return subscribeToCafeMenu(profile.uid, (value) => { setItems(value); setLoading(false); }, () => {
      setLoadError('تعذّر تحميل المنيو. تأكد من نشر قواعد Firestore الجديدة.'); setLoading(false);
    });
  }, [profile?.uid, canManage]);
  useEffect(() => {
    if (!profile?.uid) return undefined;
    return subscribeToStoreDetails(profile.uid, (details) => setCurrency(details?.currency || 'USD'), () => {});
  }, [profile?.uid]);

  const grouped = useMemo(() => MENU_CATEGORIES.map((category) => ({
    category,
    items: items.filter((item) => item.category === category),
  })).filter((group) => group.items.length), [items]);

  const openNew = () => { setEditingId(null); setDraft(blankItem); setMessage(''); setConfirmDelete(false); setEditorOpen(true); };
  const openEdit = (item) => {
    setEditingId(item.id);
    setDraft({ ...blankItem, ...item, price: String(item.price ?? '') });
    setMessage(''); setConfirmDelete(false); setEditorOpen(true);
  };
  const closeEditor = () => { if (!busy) setEditorOpen(false); };
  const save = async () => {
    if (busy) return;
    setBusy(true); setMessage('');
    try {
      if (editingId) await updateMenuItem(profile.uid, editingId, draft);
      else await createMenuItem(profile.uid, { ...draft, sortOrder: items.length });
      setEditorOpen(false);
    } catch (error) {
      setMessage(messages[error.code] || 'تعذّر حفظ الصنف. جرّب مرة أخرى.');
    } finally { setBusy(false); }
  };
  const remove = async () => {
    if (!editingId || busy) return;
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setBusy(true); setMessage('');
    try { await removeMenuItem(profile.uid, editingId); setEditorOpen(false); }
    catch (error) { setMessage(messages[error.code] || 'تعذّر حذف الصنف. جرّب مرة أخرى.'); }
    finally { setBusy(false); }
  };

  return <View style={ui.page}>
    <View style={s.header}><View><Text style={s.title}>منيو المقهى</Text><Text style={s.subtitle}>{items.length} {items.length === 1 ? 'صنف' : 'أصناف'}</Text></View><IconButton icon="arrow-forward" label="العودة للملف الشخصي" onPress={onClose} /></View>
    {!canManage && <View style={s.locked}><Ionicons name="lock-closed-outline" size={24} color={c.accent} /><View style={{ flex: 1 }}><Text style={s.lockedTitle}>إدارة المنيو مقفلة</Text><Text style={s.lockedText}>فعّل خطة Basic أو Pro من لوحة الأدمن، وسيُفتح المنيو تلقائياً.</Text></View></View>}
    {loadError ? <View style={s.center}><Text style={s.error}>{loadError}</Text></View> : loading ? <View style={s.center}><ActivityIndicator color={c.accent} size="large" /></View> :
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {!items.length ? <View style={s.empty}><Photo uri={require('../assets/mascot-breakfast-walk.png')} style={s.emptyArt} /><Text style={s.emptyTitle}>منيوك ينتظر أول صنف</Text><Text style={s.emptyText}>{canManage ? 'أضف القهوة أو الحلو المميز عندك، وسيبقى محفوظاً في Firestore.' : 'بعد تفعيل الاشتراك ستتمكن من إضافة الأصناف.'}</Text></View> : grouped.map((group) => <View key={group.category} style={s.group}>
          <Text style={s.groupTitle}>{group.category}</Text>
          {group.items.map((item) => <TouchableOpacity key={item.id} disabled={!canManage} onPress={() => openEdit(item)} style={[s.item, !item.available && s.unavailable]}>
            {item.imageURL ? <Photo uri={item.imageURL} label={`صورة ${item.name}`} style={s.itemPhoto} /> : <View style={s.itemPhotoPlaceholder}><Ionicons name="cafe-outline" size={24} color={c.accent} /></View>}
            <View style={s.itemInfo}><View style={s.itemNameRow}><Text style={s.itemName}>{item.name}</Text>{!item.available && <Text style={s.soldOut}>غير متوفر</Text>}</View>{!!item.description && <Text numberOfLines={2} style={s.itemDescription}>{item.description}</Text>}<Text style={s.price}>{formatPrice(item.price, currency)}</Text></View>
            {canManage && <Ionicons name="create-outline" size={19} color={c.muted} />}
          </TouchableOpacity>)}
        </View>)}
      </ScrollView>}
    {canManage && <View style={s.footer}><Button label="إضافة صنف جديد" icon="add" onPress={openNew} /></View>}
    <Sheet visible={editorOpen} onClose={closeEditor} title={editingId ? 'تعديل الصنف' : 'صنف جديد'}>
      <Text style={s.label}>اسم الصنف</Text><TextInput value={draft.name} onChangeText={(name) => setDraft((old) => ({ ...old, name }))} editable={!busy} maxLength={60} placeholder="مثال: سبانش لاتيه" placeholderTextColor={c.muted} style={s.input} />
      <Text style={s.label}>الوصف</Text><TextInput value={draft.description} onChangeText={(description) => setDraft((old) => ({ ...old, description }))} editable={!busy} multiline maxLength={200} placeholder="المكونات أو وصف بسيط" placeholderTextColor={c.muted} style={[s.input, s.descriptionInput]} />
      <Text style={s.label}>السعر بعملة المتجر ({currency})</Text><TextInput value={draft.price} onChangeText={(price) => setDraft((old) => ({ ...old, price }))} editable={!busy} keyboardType="decimal-pad" placeholder="0.00" placeholderTextColor={c.muted} style={s.input} />
      <Text style={s.label}>التصنيف</Text><View style={s.categories}>{MENU_CATEGORIES.map((category) => <TouchableOpacity key={category} disabled={busy} onPress={() => setDraft((old) => ({ ...old, category }))} style={[s.category, draft.category === category && s.categoryActive]}><Text style={[s.categoryText, draft.category === category && s.categoryTextActive]}>{category}</Text></TouchableOpacity>)}</View>
      <Text style={s.label}>رابط صورة الصنف — اختياري</Text><TextInput value={draft.imageURL} onChangeText={(imageURL) => setDraft((old) => ({ ...old, imageURL }))} editable={!busy} autoCapitalize="none" keyboardType="url" placeholder="https://..." placeholderTextColor={c.muted} style={[s.input, { textAlign: 'left' }]} />
      <View style={s.availability}><View><Text style={s.label}>متوفر الآن</Text><Text style={s.small}>يمكنك إخفاء الصنف مؤقتاً دون حذفه.</Text></View><Switch value={draft.available} disabled={busy} onValueChange={(available) => setDraft((old) => ({ ...old, available }))} trackColor={{ false: c.line, true: c.green }} /></View>
      {!!message && <Text accessibilityRole="alert" style={s.error}>{message}</Text>}
      <Button label={busy ? 'جارٍ الحفظ…' : 'حفظ الصنف'} icon="checkmark-outline" disabled={busy} onPress={save} />
      {editingId && <Button label={confirmDelete ? 'اضغط مرة ثانية لتأكيد الحذف' : 'حذف الصنف'} secondary icon="trash-outline" disabled={busy} onPress={remove} />}
    </Sheet>
  </View>;
}

const s = StyleSheet.create({
  header: { padding: 18, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: c.line },
  title: { color: c.text, fontSize: 24, fontWeight: '800', textAlign: 'right' }, subtitle: { color: c.muted, marginTop: 3, textAlign: 'right' },
  locked: { margin: 18, marginBottom: 0, padding: 16, borderRadius: 21, backgroundColor: c.cream, flexDirection: 'row-reverse', alignItems: 'center', gap: 12 },
  lockedTitle: { color: c.text, fontWeight: '700', textAlign: 'right' }, lockedText: { color: c.muted, fontSize: 11, lineHeight: 18, textAlign: 'right', marginTop: 3 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 }, content: { padding: 18, paddingBottom: 190, gap: 24 },
  empty: { alignItems: 'center', gap: 12, paddingVertical: 45 }, emptyIcon: { width: 76, height: 76, borderRadius: 27, backgroundColor: c.cream, alignItems: 'center', justifyContent: 'center' }, emptyArt: { width: 150, height: 130 },
  emptyTitle: { color: c.text, fontSize: 20, fontWeight: '700' }, emptyText: { color: c.muted, maxWidth: 290, textAlign: 'center', lineHeight: 21 },
  group: { gap: 10 }, groupTitle: { color: c.text, fontSize: 17, fontWeight: '700', textAlign: 'right' },
  item: { minHeight: 92, padding: 11, borderRadius: 22, backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, flexDirection: 'row-reverse', alignItems: 'center', gap: 12 },
  unavailable: { opacity: 0.58 }, itemPhoto: { width: 70, height: 70, borderRadius: 17 }, itemPhotoPlaceholder: { width: 70, height: 70, borderRadius: 17, backgroundColor: c.cream, alignItems: 'center', justifyContent: 'center' },
  itemInfo: { flex: 1, gap: 4 }, itemNameRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 }, itemName: { color: c.text, fontSize: 15, fontWeight: '700', textAlign: 'right', flexShrink: 1 },
  soldOut: { color: c.danger, fontSize: 9, backgroundColor: '#FCE9E8', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 9 }, itemDescription: { color: c.muted, fontSize: 11, lineHeight: 17, textAlign: 'right' }, price: { color: c.accent, fontSize: 13, fontWeight: '700', textAlign: 'right' },
  footer: { position: 'absolute', left: 18, right: 18, bottom: 94, zIndex: 3 }, label: { color: c.text, fontSize: 13, fontWeight: '700', textAlign: 'right' },
  input: { minHeight: 52, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 18, borderWidth: 1, borderColor: c.line, backgroundColor: c.raised, color: c.text, textAlign: 'right' }, descriptionInput: { minHeight: 94, textAlignVertical: 'top' },
  categories: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8 }, category: { paddingHorizontal: 13, paddingVertical: 9, borderRadius: 18, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface }, categoryActive: { backgroundColor: c.dark, borderColor: c.dark }, categoryText: { color: c.muted, fontSize: 11 }, categoryTextActive: { color: c.onPhoto },
  availability: { minHeight: 62, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 15 }, small: { color: c.muted, fontSize: 10, textAlign: 'right', marginTop: 4 }, error: { color: c.danger, textAlign: 'right', lineHeight: 21 },
});
