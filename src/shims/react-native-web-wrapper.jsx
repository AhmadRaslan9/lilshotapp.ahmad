// يعيد تصدير كل شيء من react-native-web، ويضيف بدائل بسيطة (stubs)
// لبعض الأسماء التي تطلبها بعض حزم Expo/RN لكنها غير موجودة أصلاً
// داخل react-native-web (لأنها خاصة بمنصتي iOS/Android فقط).
export * from 'react-native-web';

// بديل بسيط لسجلّ الأصول (الصور المستوردة عبر require) على الويب
export const AssetRegistry = {
  registerAsset(asset) {
    return asset;
  },
  getAssetByID() {
    return null;
  },
};

// بديل بسيط لِ TurboModuleRegistry (معمارية RN الجديدة) غير المتوفرة على الويب
export const TurboModuleRegistry = {
  get() {
    return null;
  },
  getEnforcing(name) {
    console.warn(`TurboModuleRegistry.getEnforcing("${name}") غير مدعومة على الويب`);
    return null;
  },
};