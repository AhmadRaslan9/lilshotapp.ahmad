import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, Image, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

export default function CameraScreen({ onClose }) {
  const camera = useRef(null);
  const mounted = useRef(true);
  const requested = useRef(false);
  const captureBusy = useRef(false);
  const [permission, requestPermission, refreshPermission] = useCameraPermissions();
  const [active, setActive] = useState(AppState.currentState !== 'background');
  const [facing, setFacing] = useState('back');
  const [ready, setReady] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [mountFailed, setMountFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    if (permission?.status === 'undetermined' && !requested.current) {
      requested.current = true;
      requestPermission().catch(() => {
        if (mounted.current) setError('Camera access could not be requested. Please try again.');
      });
    }
  }, [permission?.status, requestPermission]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
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
      if (mounted.current) setError('Allow camera access in Settings, then try again.');
    }
  };

  const restartCamera = () => {
    setReady(false);
    setError('');
    setMountFailed(false);
    setPhoto(null);
    setAttempt((value) => value + 1);
  };

  const takeShot = async () => {
    if (!ready || !camera.current || captureBusy.current) return;
    captureBusy.current = true;
    setCapturing(true);
    setError('');
    try {
      const result = await camera.current.takePictureAsync({ quality: 0.85, exif: false });
      if (!result?.uri) throw new Error('No image returned');
      if (mounted.current) { setPhoto(result); setReady(false); }
    } catch {
      if (mounted.current) setError('That shot could not be captured. Please try again.');
    } finally {
      captureBusy.current = false;
      if (mounted.current) setCapturing(false);
    }
  };

  return (
    <View style={styles.screen}>
      {permission?.granted && active && !photo && !mountFailed && (
        <CameraView key={`${facing}-${attempt}`} ref={camera} style={StyleSheet.absoluteFill}
          facing={facing} mode="picture" onCameraReady={() => setReady(true)}
          onMountError={() => {
            setReady(false); setMountFailed(true);
            setError('The camera could not open. Check that it is available and try again.');
          }} />
      )}
      {photo && <Image source={{ uri: photo.uri }} style={StyleSheet.absoluteFill} resizeMode="contain" />}
      <SafeAreaView style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.iconButton} accessibilityRole="button" accessibilityLabel="Close camera">
            <Ionicons name="close" size={26} color={colors.textOnDark} />
          </TouchableOpacity>
          <Text style={styles.brand}>LilShot</Text>
          <View style={styles.spacer} />
        </View>

        {!permission ? (
          <View style={styles.center}><ActivityIndicator color={colors.primaryLight} accessibilityLabel="Loading camera permission" /></View>
        ) : !permission.granted ? (
          <View style={styles.center}>
            <Ionicons name="camera-outline" size={56} color={colors.primaryLight} />
            <Text style={styles.title}>Your next little moment</Text>
            <Text style={styles.message}>Allow camera access to capture your coffee, right here and now.</Text>
            {Platform.OS === 'web' && !permission.canAskAgain && <Text style={styles.message}>Enable the camera in your browser's site settings, then try again.</Text>}
            <TouchableOpacity onPress={enableCamera} style={styles.action} accessibilityRole="button">
              <Text style={styles.actionText}>{!permission.canAskAgain && Platform.OS !== 'web' ? 'Open Settings' : 'Enable camera'}</Text>
            </TouchableOpacity>
          </View>
        ) : mountFailed ? (
          <View style={styles.center}>
            <Ionicons name="camera-outline" size={56} color={colors.primaryLight} />
            <Text style={styles.title}>Let's try that again</Text>
            <TouchableOpacity onPress={restartCamera} style={styles.action} accessibilityRole="button"><Text style={styles.actionText}>Retry camera</Text></TouchableOpacity>
          </View>
        ) : (
          <View style={styles.center} pointerEvents="none">
            {!ready && !photo && <ActivityIndicator color={colors.primaryLight} accessibilityLabel="Starting camera" />}
          </View>
        )}

        {error ? <Text style={styles.error} accessibilityRole="alert">{error}</Text> : null}
        {permission?.granted && !mountFailed && (
          <View style={styles.footer}>
            <Text style={styles.hint}>{photo ? 'A little moment, captured.' : 'Your coffee. This moment.'}</Text>
            {photo ? (
              <View style={styles.reviewActions}>
                <TouchableOpacity onPress={restartCamera} style={styles.action} accessibilityRole="button"><Text style={styles.actionText}>Retake</Text></TouchableOpacity>
                <TouchableOpacity onPress={onClose} style={styles.secondaryAction} accessibilityRole="button"><Text style={styles.secondaryText}>Close preview</Text></TouchableOpacity>
              </View>
            ) : (
              <View style={styles.controls}>
                <View style={styles.spacer} />
                <TouchableOpacity onPress={takeShot} disabled={!ready || capturing}
                  style={[styles.shutter, (!ready || capturing) && styles.disabled]} accessibilityRole="button"
                  accessibilityLabel="Take photo" accessibilityState={{ disabled: !ready || capturing, busy: capturing }}>
                  <View style={styles.shutterInner}>{capturing && <ActivityIndicator color={colors.cta} />}</View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setReady(false); setFacing((value) => value === 'back' ? 'front' : 'back'); }}
                  disabled={capturing || !ready} style={styles.iconButton} accessibilityRole="button"
                  accessibilityLabel="Switch camera" accessibilityState={{ disabled: capturing || !ready }}>
                  <Ionicons name="camera-reverse-outline" size={26} color={colors.textOnDark} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.feedBg },
  overlay: { flex: 1, justifyContent: 'space-between' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  brand: { color: colors.textOnDark, fontSize: 20, fontWeight: '800', textShadowColor: '#000', textShadowRadius: 6 },
  spacer: { width: 48 },
  iconButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(18,14,12,0.6)', alignItems: 'center', justifyContent: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 18 },
  title: { color: colors.textOnDark, fontSize: 24, fontWeight: '700', textAlign: 'center' },
  message: { color: colors.textOnDarkMuted, fontSize: 16, lineHeight: 23, textAlign: 'center', maxWidth: 340 },
  action: { paddingHorizontal: 28, paddingVertical: 16, borderRadius: 28, backgroundColor: colors.primaryLight },
  actionText: { color: colors.cta, fontSize: 16, fontWeight: '700' },
  secondaryAction: { paddingHorizontal: 20, paddingVertical: 16, borderRadius: 28, backgroundColor: 'rgba(18,14,12,0.75)' },
  secondaryText: { color: colors.textOnDark, fontSize: 16, fontWeight: '600' },
  error: { color: '#FFB4AC', backgroundColor: 'rgba(18,14,12,0.85)', textAlign: 'center', padding: 16, marginHorizontal: 16, borderRadius: 16 },
  footer: { padding: 24, gap: 20, alignItems: 'center', backgroundColor: 'rgba(18,14,12,0.45)' },
  hint: { color: colors.textOnDark, fontSize: 15, fontWeight: '600', textAlign: 'center' },
  controls: { width: '100%', maxWidth: 340, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  shutter: { width: 84, height: 84, borderRadius: 42, borderWidth: 3, borderColor: colors.textOnDark, padding: 5 },
  shutterInner: { flex: 1, borderRadius: 36, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: 0.45 },
  reviewActions: { flexDirection: 'row', gap: 12, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' },
});
