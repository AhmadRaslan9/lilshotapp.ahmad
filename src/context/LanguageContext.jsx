import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const copy = {
  ar: {
    home: 'الرئيسية', shops: 'المقاهي', profile: 'حسابي', camera: 'افتح الكاميرا', notifications: 'الإشعارات',
    searchPeople: 'البحث عن الأشخاص', allCities: 'كل المدن', globalShops: 'مقاهي LilShot',
    shopHeadline: 'كوب جديد،\nومكان تحبّه.', shopSubtitle: 'تصفّح المقاهي من مدن مختلفة، وشاهد الحكاية وراء كل كوب.',
    language: 'لغة التطبيق', arabic: 'العربية', english: 'English', savedLanguage: 'تم تغيير لغة التطبيق.',
    welcomeTitle: 'لحظتك الحلوة،\nتبدأ بقهوة.', welcomeSubtitle: 'صوّر لحظتك، وشاركها مع أصحابك.', createAccount: 'إنشاء حساب جديد', signIn: 'عندي حساب · تسجيل الدخول', orWith: 'أو باستخدام',
  },
  en: {
    home: 'Home', shops: 'Coffee shops', profile: 'Profile', camera: 'Open camera', notifications: 'Notifications',
    searchPeople: 'Search people', allCities: 'All cities', globalShops: 'LilShot coffee shops',
    shopHeadline: 'A new cup,\na place to love.', shopSubtitle: 'Discover coffee shops across the world and the story behind every cup.',
    language: 'App language', arabic: 'العربية', english: 'English', savedLanguage: 'App language updated.',
    welcomeTitle: 'Your little moment\nstarts with coffee.', welcomeSubtitle: 'Capture the moment and share it with your people.', createAccount: 'Create a new account', signIn: 'I already have an account', orWith: 'Or continue with',
  },
};

const LanguageContext = createContext(null);
export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState('ar');
  useEffect(() => { AsyncStorage.getItem('lilshot.locale').then((value) => { if (value === 'ar' || value === 'en') setLocaleState(value); }).catch(() => {}); }, []);
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    }
  }, [locale]);
  const setLocale = async (value) => { if (!copy[value]) return; setLocaleState(value); await AsyncStorage.setItem('lilshot.locale', value); };
  const value = useMemo(() => ({ locale, rtl: locale === 'ar', setLocale, t: (key) => copy[locale][key] || copy.ar[key] || key }), [locale]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
export function useLanguage() { const value = useContext(LanguageContext); if (!value) throw new Error('LanguageProvider is missing'); return value; }
