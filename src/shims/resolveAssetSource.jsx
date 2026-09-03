// بديل ويب لِ react-native/Libraries/Image/resolveAssetSource
// في بيئة الموبايل هذه الدالة تحوّل require('./image.png') (رقم) إلى كائن مصدر
// { uri, width, height }. على الويب، إذا كان المصدر رابط (string) أو كائن جاهز
// (مثلاً من import ES module) نعيده كما هو، وإن كان رقمًا (حالة نادرة على الويب) نعيد null.
export default function resolveAssetSource(source) {
  if (source == null) return null;
  if (typeof source === 'number') return null;
  if (typeof source === 'string') return { uri: source };
  return source;
}
