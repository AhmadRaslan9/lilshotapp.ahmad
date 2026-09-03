// src/theme/colors.js
//
// اللوحة اللونية لتطبيق Lil'Shot — مستوحاة من هوية المتجر الأصلية
// (الكريمي الدافئ + البرتقالي الخاص بحبة القهوة + الزجاج الداكن لشريط
// التنقل). تم توحيدها هنا حتى تُستخدم بنفس القيم في كل الشاشات بدل
// تكرار القيم الست عشرية داخل كل ملف كما كان سابقاً.

const colors = {
  // ---- Brand -------------------------------------------------------------
  primary: '#C97A3F', // برتقالي التوست/حبة القهوة المحمصة
  primaryDark: '#A6602D',
  primaryLight: '#E9A66B',
  primarySoft: 'rgba(201, 122, 63, 0.14)',

  // ---- Neutrals / Surfaces ------------------------------------------------
  background: '#F8F4EF', // كريمي دافئ بدل الرمادي الفاتح القديم
  surface: '#FFFFFF',
  surfaceMuted: '#F1EAE2',
  border: '#EAE1D6',

  // ---- Text ----------------------------------------------------------------
  textPrimary: '#241C15',
  textSecondary: '#8A7B6C',
  textOnDark: '#FFFFFF',
  textOnDarkMuted: 'rgba(255,255,255,0.68)',
  textOnDarkFaint: 'rgba(255,255,255,0.45)',

  // ---- Glass (liquid-glass surfaces used on photo backgrounds) -----------
  glassDark: 'rgba(26, 20, 15, 0.55)',
  glassDarkStrong: 'rgba(18, 14, 11, 0.72)',
  glassLight: 'rgba(255, 255, 255, 0.16)',
  glassBorder: 'rgba(255, 255, 255, 0.28)',
  glassBorderStrong: 'rgba(255, 255, 255, 0.5)',

  // ---- Status ---------------------------------------------------------------
  danger: '#E1584B',
  dangerSoft: 'rgba(225, 88, 75, 0.14)',
  success: '#4C9E77',
  warning: '#E0A62E',

  // ---- Misc ------------------------------------------------------------------
  tagBackground: 'rgba(233, 166, 107, 0.85)',
  overlay: 'rgba(0, 0, 0, 0.35)',
  shadow: '#1A1410',
};

export default colors;
