import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, Image, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { coffee as c } from '../theme/coffee';
import { PressableScale } from '../components/coffee/Motion';

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
  const [flash, setFlash] = useState(false);
  const [timer, setTimer] = useState(0);
  const [countdown, setCountdown] = useState(0);
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
  const captureNow = async () => {
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
  const takeShot = async () => {
    if (timer > 0) {
      setCountdown(timer);
      for (let left = timer; left > 0; left -= 1) {
        if (!mounted.current) return;
        setCountdown(left);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      if (mounted.current) setCountdown(0);
    }
    await captureNow();
  };
  const shutterDisabled = !active || !ready || capturing || !!photo;

  const tool = (icon, label, onPress, disabled = false) => <PressableScale onPress={onPress} disabled={disabled} style={s.tool} accessibilityRole="button" accessibilityLabel={label}>
    <Ionicons name={icon} size={21} color="#fff" />
  </PressableScale>;

  return <View style={s.screen}>
    <View style={[s.viewfinder, { marginTop: Math.max(insets.top, 10), marginBottom: Math.max(insets.bottom, 10) }]}>
        {permission?.granted && active && !photo && !mountFailed && <CameraView
          key={`${facing}-${attempt}`} ref={camera} style={StyleSheet.absoluteFill} facing={facing} mode="picture"
          flash={flash ? 'on' : 'off'}
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

        <SafeAreaView style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <View style={s.topBar}>
            <PressableScale onPress={onClose} style={s.glassButton} accessibilityRole="button" accessibilityLabel="إغلاق الكاميرا"><Ionicons name="close" size={22} color="#fff" /></PressableScale>
            <PressableScale onPress={() => setFlash(value => !value)} style={[s.flash, flash && s.flashOn]} accessibilityRole="button" accessibilityLabel="الفلاش"><Ionicons name="flash" size={21} color={flash ? c.dark : '#fff'} /></PressableScale>
            <View style={{ width: 46 }} />
          </View>
          {!photo && permission?.granted && <View style={s.tools}>
            {tool('camera-reverse-outline', 'تبديل الكاميرا', () => { setReady(false); setFacing(value => value === 'back' ? 'front' : 'back'); }, shutterDisabled)}
            {tool('timer-outline', `المؤقت ${timer || 'متوقف'}`, () => setTimer(value => value === 0 ? 3 : value === 3 ? 10 : 0))}
            {tool('text-outline', 'النص قريبًا', undefined, true)}
            {tool('musical-notes-outline', 'الموسيقى قريبًا', undefined, true)}
            {tool('images-outline', 'اختيار صورة قريبًا', undefined, true)}
          </View>}
          {!!countdown && <View style={s.countdown}><Text style={s.countdownText}>{countdown}</Text></View>}
          {!!error && <Text style={s.error} accessibilityRole="alert">{error}</Text>}
          <View style={s.bottom}>
            {photo ? <View style={s.review}>
              <PressableScale onPress={restartCamera} style={s.reviewButton}><Ionicons name="refresh" size={20} color="#fff" /><Text style={s.reviewText}>إعادة</Text></PressableScale>
              <PressableScale onPress={onClose} style={[s.reviewButton, s.useButton]}><Ionicons name="checkmark" size={21} color={c.dark} /><Text style={[s.reviewText, { color: c.dark }]}>استخدام</Text></PressableScale>
            </View> : <>
              <View style={s.captureRow}>
                <TouchableOpacity disabled style={s.thumb} accessibilityLabel="الاستديو قريبًا"><Ionicons name="images-outline" size={22} color="#fff" /></TouchableOpacity>
                <PressableScale onPress={takeShot} disabled={shutterDisabled} style={[s.shutter, shutterDisabled && s.disabled]} accessibilityRole="button" accessibilityLabel="التقاط الصورة">
                  <View style={s.shutterInner}>{capturing && <ActivityIndicator color={c.dark} />}</View>
                </PressableScale>
                <View style={s.timerBadge}><Text style={s.timerText}>{timer ? `${timer}s` : 'LIL'}</Text></View>
              </View>
              <View style={s.modes}><Text style={s.mode}>لحظة</Text><Text style={[s.mode, s.activeMode]}>صورة</Text><Text style={s.mode}>منشور</Text></View>
            </>}
          </View>
        </SafeAreaView>
      </View>
  </View>;
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000000', paddingHorizontal: 8 },
  viewfinder: { flex: 1, maxWidth: 520, width: '100%', alignSelf: 'center', borderRadius: 28, overflow: 'hidden', backgroundColor: '#1C1C1E', borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,.22)' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 },
  title: { color: c.onPhoto, fontSize: 22, fontWeight: '700', textAlign: 'center', letterSpacing: -0.3 },
  message: { color: 'rgba(255,255,255,.7)', fontSize: 14, lineHeight: 23, textAlign: 'center', maxWidth: 300 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  glassButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(28,28,30,.62)', borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,.28)', alignItems: 'center', justifyContent: 'center' },
  flash: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(28,28,30,.62)', borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,.28)', alignItems: 'center', justifyContent: 'center' },
  flashOn: { backgroundColor: '#fff' },
  tools: { position: 'absolute', right: 14, top: 76, gap: 9 },
  tool: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(28,28,30,.62)', borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,.24)', alignItems: 'center', justifyContent: 'center' },
  countdown: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  countdownText: { color: '#fff', fontSize: 92, fontWeight: '900', textShadowColor: 'rgba(0,0,0,.5)', textShadowRadius: 18 },
  bottom: { position: 'absolute', left: 14, right: 14, bottom: 14, gap: 14 },
  captureRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  shutter: { width: 82, height: 82, borderRadius: 41, backgroundColor: 'rgba(255,255,255,.24)', borderWidth: 3, borderColor: '#fff', padding: 6 },
  shutterInner: { flex: 1, borderRadius: 34, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  thumb: { width: 46, height: 46, borderRadius: 15, backgroundColor: 'rgba(0,0,0,.46)', borderWidth: 1, borderColor: 'rgba(255,255,255,.35)', alignItems: 'center', justifyContent: 'center' },
  timerBadge: { width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(0,0,0,.46)', alignItems: 'center', justifyContent: 'center' },
  timerText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  modes: { alignSelf: 'center', flexDirection: 'row-reverse', gap: 3, padding: 4, backgroundColor: 'rgba(28,28,30,.72)', borderRadius: 22, borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,.22)' },
  mode: { color: '#C7C7CC', fontSize: 11, minWidth: 68, textAlign: 'center', paddingVertical: 8, borderRadius: 18 },
  activeMode: { color: c.dark, backgroundColor: '#fff', fontWeight: '800' },
  disabled: { opacity: 0.5 },
  action: { minHeight: 50, paddingHorizontal: 23, paddingVertical: 14, borderRadius: 16, backgroundColor: c.cream, alignItems: 'center', justifyContent: 'center' },
  actionText: { color: c.dark, fontSize: 14, fontWeight: '700' },
  secondaryAction: { minHeight: 50, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 27, backgroundColor: '#E9DFD1' },
  secondaryText: { color: c.dark, fontSize: 14, fontWeight: '600' },
  review: { flexDirection: 'row-reverse', gap: 10, justifyContent: 'center' },
  reviewButton: { minWidth: 118, minHeight: 50, paddingHorizontal: 18, borderRadius: 26, backgroundColor: 'rgba(0,0,0,.65)', flexDirection: 'row-reverse', gap: 8, alignItems: 'center', justifyContent: 'center' },
  useButton: { backgroundColor: c.accent },
  reviewText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  error: { position: 'absolute', left: 20, right: 20, bottom: 160, color: '#fff', backgroundColor: 'rgba(145,35,35,.82)', textAlign: 'center', fontSize: 12, lineHeight: 20, padding: 12, borderRadius: 17 },
});
