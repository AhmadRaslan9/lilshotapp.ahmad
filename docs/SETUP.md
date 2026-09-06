# خطوات التجهيز

## الوضع المؤكد — 2026-09-06

- لدى أحمد حساب Expo، ولا يوجد Mac أو عضوية Apple Developer.
- مشروع Firebase موجود: `lilshot-dbfe1` (الاسم lilshot).
- إعدادات JavaScript SDK المرسلة من صاحب المشروع مضمّنة في `src/services/firebase/clientConfig.js`.
- الصورة تعرض Spark وتطبيق ويب باسم `lilshot-admin`. اسم التسجيل لا يمنح التطبيق صلاحيات إدارة.
- تم تجهيز تهيئة Auth وFirestore وStorage في الكود؛ لم يُثبت اتصال حي أو إنشاء قاعدة أو bucket أو قواعد أمان من خلال هذه الخطوة.

## المطلوب من أحمد الآن

افتح Firebase Console → Authentication → Sign-in method. تأكد من تفعيل Email/Password ثم Save، وأرسل صورة قائمة طرق الدخول للتأكد من الحالة. لا حاجة لتفعيل تسجيل الدخول برابط البريد في هذه المرحلة.

لا تشارك كلمات المرور أو مفاتيح service account أو مفاتيح Apple الخاصة.

## تشغيل معاينة الويب

```sh
npm ci
npm run dev
```

لا تحتاج ملف بيئة لاستخدام إعدادات المشروع المضمّنة. إذا احتجت مشروعاً آخر، انسخ `.env.example` إلى `.env` واملأ القيم الست المطلوبة كاملة؛ القيم الناقصة تُرفض لتجنب خلط مشروعين. القيم الاختيارية تخص المشروع البديل فقط. إعدادات العميل عامة وتُضمّن في الحزمة؛ قواعد الأمان تتحكم بالوصول.

تستخدم الشاشات الحالية Firebase Auth عند إدخال البريد وكلمة المرور، ويذهب Start now إلى التسجيل بدلاً من الدخول التجريبي التلقائي. تفعيل مزود البريد وصحة القواعد لم يُتحقق منهما حياً. الموجز والعديد من الشاشات ما زالت تجريبية؛ لا رفع صور بعد. وجود databaseURL وmeasurementId في الإعداد لا يشغّل Realtime Database أو Analytics.

`npm start` يشغّل الويب. تجهيز Native ونسخة Expo متوافقة ما زال مطلوباً قبل تجربة Expo Go. بناء iPhone مستقل عبر EAS يمكن عمله دون Mac لكنه يحتاج عضوية Apple Developer لتوقيع نسخة الجهاز. لا نطلب شراء العضوية الآن.

Cloud Storage يحتاج خطة Blaze حسب متطلبات Firebase الحالية. نجهّز قواعد التخزين وحدود الرفع قبل تفعيل الفوترة واختبار الصور الفعلي.

## التحقق

```sh
node --test tests/firebase-config.test.mjs
npm run build
```

اختبارات اختيار الإعداد محلية ولا تسجّل مستخدمين أو ترسل رسائل أو تكتب في Firebase. لا تعادل اختبار تسجيل دخول فعلي أو تحققاً من أمان القواعد.

## عمل المطور التالي

تجهيز Native والجلسة، قواعد وصول مختبرة، ثم تسجيل الدخول على الجهاز ورفع اللقطات ودورة حذفها. ما زال Apple Sign In والاشتراكات بحاجة تنفيذ وإعداد مستقلين.

## المراجع الرسمية

- [إعداد Firebase JavaScript SDK](https://firebase.google.com/docs/web/setup)
- [تفعيل البريد وكلمة المرور](https://firebase.google.com/docs/auth/web/password-auth)
- [بناء iOS عبر EAS](https://docs.expo.dev/tutorial/eas/ios-development-build-for-devices/)
- [متطلبات Storage](https://firebase.google.com/docs/storage/faqs-storage-changes-announced-sept-2024)
