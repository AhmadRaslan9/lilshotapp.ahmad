import React from 'react';
import {
  View, Text, ImageBackground, ScrollView, TouchableOpacity,
  StyleSheet, useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const backgroundImg = require('../../assets/CoffeeShop.png');

// Welcome layout follows the owner's photo-led reference. Account actions keep
// using AuthNavigator/Firebase; Apple remains unavailable until its flow exists.
export default function WelcomeScreen({ onSignIn, onSignUp }) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const compact = width < 360 || height < 700;
  const minimumHeight = Math.max(570, height - insets.top - insets.bottom);

  return (
    <View style={[styles.page, { height }]}>
      <ImageBackground source={backgroundImg} style={styles.background} resizeMode="cover">
        <LinearGradient
          colors={['rgba(250,247,242,0.97)', 'rgba(250,247,242,0.88)', 'rgba(250,247,242,0.08)', 'rgba(39,28,23,0.15)']}
          locations={[0, 0.24, 0.58, 1]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <SafeAreaView style={styles.safe}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.content, { minHeight: minimumHeight }]}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={[styles.intro, compact && styles.introCompact]}>
              <Text style={styles.wordmark}>lilshot<Text style={styles.brandDot}>.</Text></Text>
              <Text accessibilityRole="header" style={[styles.headline, compact && styles.headlineCompact]}>
                {'لحظتك الحلوة،\nتبدأ بقهوة.'}
              </Text>
              <Text style={styles.subtitle}>صوّر لحظتك، وشاركها مع أصحابك.</Text>
            </View>

            <View style={styles.photoSpace} />

            <View style={styles.card}>
              <View style={styles.accountActions}>
                <TouchableOpacity
                  onPress={onSignUp}
                  accessibilityRole="button"
                  accessibilityLabel="إنشاء حساب جديد"
                  activeOpacity={0.85}
                  style={styles.createButton}
                >
                  <Text style={styles.createText}>إنشاء حساب جديد</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onSignIn}
                  accessibilityRole="button"
                  accessibilityLabel="عندي حساب · تسجيل الدخول"
                  activeOpacity={0.65}
                  style={styles.signInButton}
                >
                  <Text style={styles.signInText}>عندي حساب · تسجيل الدخول</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.divider} />

              <View style={styles.socialSection}>
                <Text style={styles.socialLabel}>أو باستخدام</Text>
                <View style={styles.appleGroup}>
                  <TouchableOpacity
                    disabled
                    accessibilityRole="button"
                    accessibilityLabel="تسجيل الدخول باستخدام Apple، قريباً"
                    accessibilityState={{ disabled: true }}
                    style={styles.appleButton}
                  >
                    <Ionicons name="logo-apple" size={25} color="#342B2A" />
                  </TouchableOpacity>
                  <Text style={styles.comingSoon}>Apple · قريباً</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, width: '100%', maxWidth: 480, alignSelf: 'center', backgroundColor: '#ECE5DA' },
  background: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 20 },
  intro: { alignItems: 'center', paddingTop: 32, paddingHorizontal: 4 },
  introCompact: { paddingTop: 20 },
  wordmark: { color: '#352B29', fontSize: 22, fontWeight: '800', letterSpacing: -0.8, marginBottom: 24 },
  brandDot: { color: '#A56C47' },
  headline: { color: '#352B29', fontSize: 43, lineHeight: 60, fontWeight: '800', textAlign: 'center', writingDirection: 'rtl' },
  headlineCompact: { fontSize: 35, lineHeight: 51 },
  subtitle: { color: '#554943', fontSize: 14, lineHeight: 25, textAlign: 'center', writingDirection: 'rtl', marginTop: 12 },
  photoSpace: { flexGrow: 1, minHeight: 80 },
  card: { backgroundColor: '#FFFEFC', borderRadius: 32, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)', shadowColor: '#332720', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.12, shadowRadius: 24, elevation: 5 },
  accountActions: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 3, gap: 7 },
  createButton: { minHeight: 55, borderRadius: 30, backgroundColor: '#392C2C', justifyContent: 'center', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 16 },
  createText: { color: '#FFFDF9', fontSize: 15, fontWeight: '700', textAlign: 'center' },
  signInButton: { minHeight: 50, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 12 },
  signInText: { color: '#392F2D', fontSize: 14, fontWeight: '600', textAlign: 'center', writingDirection: 'rtl' },
  divider: { height: 1, backgroundColor: '#F0ECE7', marginTop: 1 },
  socialSection: { paddingTop: 15, paddingBottom: 18, alignItems: 'center', gap: 11 },
  socialLabel: { color: '#82766F', fontSize: 12 },
  appleGroup: { alignItems: 'center', gap: 5 },
  appleButton: { width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: '#EAE5DF', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' },
  comingSoon: { color: '#82766F', fontSize: 10 },
});
