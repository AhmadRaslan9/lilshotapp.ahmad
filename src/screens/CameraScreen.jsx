import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, Image, Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { coffee as c } from '../theme/coffee';

export default function CameraScreen({ onClose }) {
  const camera = useRef(null);
  const mounted = useRef(true);
  const requested = useRef(false);
  const captureBusy = useRef(false);
  const [permission, requestPermission, refreshPermission] = useCameraPermissions();
  const [active, setActive] = useState(!AppState.currentState || AppState.currentState === 'active');
  const [facing, setFacing] = useState('back');
  const [ready, setReady] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [mountFailed, setMountFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);
  useEffect(() => {
    if (permission?.status === 'undetermined' && !requested.current) {
      requested.current = true;
      requestPermission().catch(() => {
        if (mounted.current) setError('تعذّر طلب إذن الكاميرا. جرّب مرة أخرى.');
      });
    }
  }, [permission?.status, requestPermission]);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      setActive(state === 'active');
      setReady(false);
      if (state === 'active') refreshPermission().catch(() => {});
    });
    return () => subscription.remove();
  }, [refreshPermission]);

  const enableCamera = async () => {
    setError('');
    try {
      if (permission && !permission.canAskAgain && Platform.OS !== 'web') await Linking.openSettings();
      else await requestPermission();
    } catch {
      if (mounted.current) setError('اسمح بالكاميرا من الإعدادات ثم جرّب مرة أخرى.');
    }
  };
  const restartCamera = () => {
    setReady(false);
    setError('');
    setMountFailed(false);
    setPhoto(null);
    setAttempt(value => value + 1);
  };
  const takeShot = async () => {
    if (!active || !ready || !camera.current || captureBusy.current) return;
    captureBusy.current = true;
    setCapturing(true);
    setError('');
    try {
      const result = await camera.current.takePictureAsync({ quality: 0.85, exif: false });
      if (!result?.uri) throw new Error('No image returned');
      if (mounted.current) { setPhoto(result); setReady(false); }
    } catch {
      if (mounted.current) setError('ما قدرنا نلتقط الصورة. جرّب مرة ثانية.');
    } finally {
      captureBusy.current = false;
      if (mounted.current) setCapturing(false);
    }
  };
  const shutterDisabled = !active || !ready || capturing || !!photo;

  return <SafeAreaView style={s.screen}>
    <ScrollView contentContainerStyle={[s.content, { minHeight: Math.max(650, height - insets.top - insets.bottom) }]} showsVerticalScrollIndicator={false} bounces={false}>
      <View style={s.header}>
        <TouchableOpacity onPress={onClose} style={s.iconButton} accessibilityRole="button" accessibilityLabel="إغلاق الكاميرا">
          <Ionicons name="arrow-back" size={22} color={c.dark} />
        </TouchableOpacity>
        <View style={s.live}><View style={[s.liveDot, photo && { backgroundColor: c.green }]} /><Text style={s.liveText}>{photo ? 'YOUR LITTLE SHOT' : 'LIVE · CAPTURE'}</Text></View>
        <Text style={s.wordmark}>ls.</Text>
      </View>

      <View style={s.viewfinder}>
        {permission?.granted && active && !photo && !mountFailed && <CameraView
          key={`${facing}-${attempt}`} ref={camera} style={StyleSheet.absoluteFill} facing={facing} mode="picture"
          onCameraReady={() => { if (mounted.current) setReady(true); }}
          onMountError={() => {
            if (!mounted.current) return;
            setReady(false); setMountFailed(true);
            setError('تعذّر فتح الكاميرا. تأكد إنها متاحة وجرّب مرة أخرى.');
          }} />}
        {photo && <Image source={{ uri: photo.uri }} style={StyleSheet.absoluteFill} resizeMode="contain" accessibilityLabel="معاينة اللقطة" />}

        {!permission ? <View style={s.center}><ActivityIndicator color={c.accent} accessibilityLabel="جارٍ تحميل إذن الكاميرا" /></View>
          : !permission.granted ? <View style={s.center}>
            <Ionicons name="camera-outline" size={44} color={c.accent} />
            <Text style={s.title}>لحظتك الحلوة تبدأ هنا</Text>
            <Text style={s.message}>اسمح بالكاميرا وصوّر قهوتك في لحظتها.</Text>
            {Platform.OS === 'web' && !permission.canAskAgain && <Text style={s.message}>فعّل إذن الكاميرا من إعدادات الموقع في المتصفح، ثم جرّب.</Text>}
            <TouchableOpacity onPress={enableCamera} style={s.action} accessibilityRole="button"><Text style={s.actionText}>{!permission.canAskAgain && Platform.OS !== 'web' ? 'فتح الإعدادات' : 'السماح بالكاميرا'}</Text></TouchableOpacity>
          </View> : mountFailed ? <View style={s.center}>
            <Ionicons name="camera-outline" size={44} color={c.accent} /><Text style={s.title}>خلّنا نجرّب مرة ثانية</Text>
            <TouchableOpacity onPress={restartCamera} style={s.action} accessibilityRole="button"><Text style={s.actionText}>إعادة المحاولة</Text></TouchableOpacity>
          </View> : !photo && <View style={s.center} pointerEvents="none">
            {!active ? <Text style={s.message}>الكاميرا متوقفة مؤقتاً</Text> : !ready && <ActivityIndicator color={c.accent} accessibilityLabel="جارٍ فتح الكاميرا" />}
          </View>}

        {permission?.granted && !mountFailed && <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <View style={[s.corner, s.topLeft]} /><View style={[s.corner, s.topRight]} /><View style={[s.corner, s.bottomLeft]} /><View style={[s.corner, s.bottomRight]} />
          {!photo && ready && <View style={s.frameHint}><Text style={s.frameHintText}>قهوتك في الكادر، والباقي إحساسك.</Text></View>}
        </View>}
      </View>

      {error ? <Text style={s.error} accessibilityRole="alert">{error}</Text> : null}
      <View style={s.footer}>
        <View style={s.captionRow}><Text style={s.smallLabel}>{photo ? 'لحظة تستاهل.' : 'التقطها، قبل ما تبرد.'}</Text><Text style={s.edition}>LITTLE SHOTS. GOOD TIMES.</Text></View>
        {photo ? <View style={s.review}>
          <TouchableOpacity onPress={restartCamera} style={s.action} accessibilityRole="button"><Text style={s.actionText}>صوّر من جديد</Text></TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={s.secondaryAction} accessibilityRole="button"><Text style={s.secondaryText}>إغلاق المعاينة</Text></TouchableOpacity>
        </View> : <View style={s.controls}>
          <View style={s.sideControl} accessibilityLabel="الاستديو لمشتركي Plus، قريباً" accessibilityRole="button" accessibilityState={{ disabled: true }}>
            <View style={s.gallery}><Ionicons name="images-outline" size={21} color={c.muted} /><View style={s.lock}><Ionicons name="lock-closed" size={9} color={c.onPhoto} /></View></View><Text style={s.controlLabel}>الاستديو · Plus</Text>
          </View>
          <TouchableOpacity onPress={takeShot} disabled={shutterDisabled} style={[s.shutter, shutterDisabled && s.disabled]}
            accessibilityRole="button" accessibilityLabel="التقاط الصورة" accessibilityState={{ disabled: shutterDisabled, busy: capturing }}>
            <View style={s.shutterInner}>{capturing && <ActivityIndicator color={c.accent} />}</View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { if (captureBusy.current) return; setReady(false); setFacing(value => value === 'back' ? 'front' : 'back'); }}
            disabled={shutterDisabled} style={s.sideControl} accessibilityRole="button" accessibilityLabel="تبديل الكاميرا" accessibilityState={{ disabled: shutterDisabled }}>
            <View style={s.flip}><Ionicons name="camera-reverse-outline" size={24} color={c.dark} /></View><Text style={s.controlLabel}>تبديل</Text>
          </TouchableOpacity>
        </View>}
        <Text style={s.notice}>{photo ? 'معاينة فقط · الصورة لا تُحفظ بعد الإغلاق. النشر قريباً.' : 'صوّر اللحظة كما هي. نشر الصور والاستديو قريباً.'}</Text>
      </View>
    </ScrollView>
  </SafeAreaView>;
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F6F1E9' },
  content: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 24, gap: 18 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 2 },
  iconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFCF5', alignItems: 'center', justifyContent: 'center' },
  live: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#B45B4E' },
  liveText: { color: c.dark, fontSize: 9, letterSpacing: 2, fontWeight: '600' },
  wordmark: { color: c.accent, width: 44, textAlign: 'center', fontSize: 24, fontWeight: '800' },
  viewfinder: { flex: 1, minHeight: 300, borderRadius: 30, overflow: 'hidden', backgroundColor: '#E6DDD0' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 },
  title: { color: c.dark, fontSize: 21, fontWeight: '700', textAlign: 'center' },
  message: { color: '#655A50', fontSize: 14, lineHeight: 23, textAlign: 'center', maxWidth: 300 },
  corner: { position: 'absolute', width: 20, height: 20, borderColor: 'rgba(255,252,241,0.75)' },
  topLeft: { top: 22, left: 22, borderLeftWidth: 2, borderTopWidth: 2, borderTopLeftRadius: 4 },
  topRight: { top: 22, right: 22, borderRightWidth: 2, borderTopWidth: 2, borderTopRightRadius: 4 },
  bottomLeft: { bottom: 22, left: 22, borderLeftWidth: 2, borderBottomWidth: 2, borderBottomLeftRadius: 4 },
  bottomRight: { bottom: 22, right: 22, borderRightWidth: 2, borderBottomWidth: 2, borderBottomRightRadius: 4 },
  frameHint: { position: 'absolute', bottom: 25, alignSelf: 'center', backgroundColor: c.glass, borderRadius: 20, paddingVertical: 7, paddingHorizontal: 12, maxWidth: '76%' },
  frameHintText: { color: c.onPhoto, fontSize: 10, textAlign: 'center' },
  footer: { gap: 23 },
  captionRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' },
  smallLabel: { color: '#897561', fontSize: 11 },
  edition: { color: '#897561', fontSize: 7, letterSpacing: 1 },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 6 },
  shutter: { width: 86, height: 86, borderRadius: 43, backgroundColor: '#FBF8EE', borderWidth: 1, borderColor: '#FFF', padding: 6, shadowColor: '#77634E', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
  shutterInner: { flex: 1, borderRadius: 38, borderWidth: 1.5, borderColor: '#E8DFCC', backgroundColor: '#FFFDF7', alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: 0.5 },
  sideControl: { width: 82, minHeight: 64, gap: 7, alignItems: 'center', justifyContent: 'center' },
  gallery: { width: 42, height: 42, borderRadius: 13, borderWidth: 1, borderColor: '#D5C8B9', backgroundColor: '#EDE5D8', alignItems: 'center', justifyContent: 'center' },
  lock: { position: 'absolute', right: -4, bottom: -4, width: 18, height: 18, borderRadius: 9, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' },
  flip: { height: 42, justifyContent: 'center' },
  controlLabel: { color: c.muted, fontSize: 9 },
  notice: { color: c.muted, fontSize: 10, lineHeight: 19, textAlign: 'center' },
  action: { minHeight: 50, paddingHorizontal: 23, paddingVertical: 14, borderRadius: 27, backgroundColor: c.dark, alignItems: 'center', justifyContent: 'center' },
  actionText: { color: c.onPhoto, fontSize: 14, fontWeight: '600' },
  secondaryAction: { minHeight: 50, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 27, backgroundColor: '#E9DFD1' },
  secondaryText: { color: c.dark, fontSize: 14, fontWeight: '600' },
  review: { flexDirection: 'row-reverse', gap: 10, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', paddingVertical: 12 },
  error: { color: '#913F35', backgroundColor: '#F3DDD6', textAlign: 'center', fontSize: 12, lineHeight: 20, padding: 14, borderRadius: 17 },
});
