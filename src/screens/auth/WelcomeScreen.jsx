import React from 'react';
import {
  View, Text, Image, ImageBackground, ScrollView, TouchableOpacity,
  StyleSheet, useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../context/LanguageContext';
import { FadeInView, PressableScale } from '../../components/coffee/Motion';

const backgroundImg = require('../../assets/CoffeeShop.png');

// Welcome layout follows the owner's photo-led reference. Account actions keep
// using AuthNavigator/Firebase; Apple remains unavailable until its flow exists.
export default function WelcomeScreen({ onSignIn, onSignUp }) {
  const { locale, setLocale, t } = useLanguage();
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
            <FadeInView style={[styles.intro, compact && styles.introCompact]}>
              <View style={styles.languages}><TouchableOpacity onPress={() => setLocale('ar')} style={[styles.language, locale === 'ar' && styles.languageActive]}><Text style={[styles.languageText, locale === 'ar' && styles.languageTextActive]}>AR</Text></TouchableOpacity><TouchableOpacity onPress={() => setLocale('en')} style={[styles.language, locale === 'en' && styles.languageActive]}><Text style={[styles.languageText, locale === 'en' && styles.languageTextActive]}>EN</Text></TouchableOpacity></View>
              <View style={styles.logoWrap}><Image source={require('../../assets/logo-mark.png')} resizeMode="contain" style={styles.logo} /></View>
              <Text accessibilityRole="header" style={[styles.headline, locale === 'en' ? styles.decorativeHeadline : styles.arabicHeadline, compact && styles.headlineCompact]}>
                {t('welcomeTitle')}
              </Text>
              <Text style={styles.subtitle}>{t('welcomeSubtitle')}</Text>
            </FadeInView>

            <View style={styles.photoSpace} />

            <FadeInView delay={120} distance={18} style={styles.card}>
              <View style={styles.accountActions}>
                <PressableScale
                  onPress={onSignUp}
                  accessibilityRole="button"
                  accessibilityLabel="إنشاء حساب جديد"
                  style={styles.createButton}
                >
                  <Text style={styles.createText}>{t('createAccount')}</Text>
                </PressableScale>
                <PressableScale
                  onPress={onSignIn}
                  accessibilityRole="button"
                  accessibilityLabel="عندي حساب · تسجيل الدخول"
                  style={styles.signInButton}
                >
                  <Text style={styles.signInText}>{t('signIn')}</Text>
                </PressableScale>
              </View>

              <View style={styles.divider} />

              <View style={styles.socialSection}>
                <Text style={styles.socialLabel}>{t('orWith')}</Text>
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
            </FadeInView>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, width: '100%', maxWidth: 480, alignSelf: 'center', backgroundColor: '#F2F2F7' },
  background: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 20 },
  intro: { alignItems: 'center', paddingTop: 32, paddingHorizontal: 4 },
  introCompact: { paddingTop: 20 },
  languages: { flexDirection: 'row', gap: 5, alignSelf: 'flex-end', marginBottom: 8 }, language: { paddingHorizontal: 11, paddingVertical: 7, borderRadius: 14, backgroundColor: 'rgba(255,255,255,.8)', borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(60,60,67,.16)' }, languageActive: { backgroundColor: '#1C1C1E' }, languageText: { color: '#6E6E73', fontSize: 10, fontWeight: '800' }, languageTextActive: { color: '#fff' },
  logoWrap: { width: 66, height: 66, borderRadius: 20, backgroundColor: '#1C1C1E', alignItems: 'center', justifyContent: 'center', marginBottom: 22, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: .18, shadowRadius: 14, elevation: 4 },
  logo: { width: 50, height: 50 },
  headline: { color: '#1D1D1F', fontSize: 43, lineHeight: 58, fontWeight: '800', textAlign: 'center', writingDirection: 'rtl', letterSpacing: -1 },
  arabicHeadline: { fontFamily: 'Kufam-Bold', writingDirection: 'rtl' },
  decorativeHeadline: { fontFamily: 'Pacifico', fontWeight: '400', lineHeight: 66, letterSpacing: 0 },
  headlineCompact: { fontSize: 35, lineHeight: 51 },
  subtitle: { color: '#554943', fontSize: 14, lineHeight: 25, textAlign: 'center', writingDirection: 'rtl', marginTop: 12 },
  photoSpace: { flexGrow: 1, minHeight: 80 },
  card: { backgroundColor: 'rgba(255,255,255,.96)', borderRadius: 28, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(60,60,67,.16)', shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.12, shadowRadius: 26, elevation: 5 },
  accountActions: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 3, gap: 7 },
  createButton: { minHeight: 54, borderRadius: 16, backgroundColor: '#1C1C1E', justifyContent: 'center', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 16 },
  createText: { color: '#FFFDF9', fontSize: 15, fontWeight: '700', textAlign: 'center' },
  signInButton: { minHeight: 50, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 12 },
  signInText: { color: '#392F2D', fontSize: 14, fontWeight: '600', textAlign: 'center', writingDirection: 'rtl' },
  divider: { height: 1, backgroundColor: '#F0ECE7', marginTop: 1 },
  socialSection: { paddingTop: 15, paddingBottom: 18, alignItems: 'center', gap: 11 },
  socialLabel: { color: '#82766F', fontSize: 12 },
  appleGroup: { alignItems: 'center', gap: 5 },
  appleButton: { width: 48, height: 48, borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, borderColor: '#E5E5EA', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' },
  comingSoon: { color: '#82766F', fontSize: 10 },
});
