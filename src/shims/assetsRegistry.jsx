// بديل بسيط لـ @react-native/assets-registry/registry
// الملف الأصلي مكتوب بصيغة Flow (export type ...) وesbuild ما بيقدر يفسرها.
// هاد البديل بيوفر نفس الدوال بشكل بسيط يكفي لعمل الموقع على الويب.
export function registerAsset(asset) {
  return asset;
}

export function getAssetByID(assetId) {
  return null;
}

export default { registerAsset, getAssetByID };