# خطوات التجهيز

## المطلوب من أحمد الآن

1. جهّز حساباً في [Expo](https://expo.dev/signup) للتجارب والبناء، أو استخدم فريقك الموجود.
2. افتح [Firebase Console](https://console.firebase.google.com/) وأخبرنا هل لديك مشروع قائم. إن وجد، أرسل اسمه أو Project ID ولا تنشئ نسخة مكررة. إن لم يوجد، أنشئ مشروع تطوير باسم واضح مثل LilShot Dev وأرسل المعرّف الذي اختاره Firebase.
3. أخبرنا هل لديك Mac وعضوية Apple Developer مدفوعة أم لا، لتحديد مسار تجربة iPhone وTestFlight. لا حاجة لشراء خدمات إضافية قبل تحديد المسار.

لا تشارك كلمات المرور أو service account أو مفاتيح Apple الخاصة. أي وصول لفريق العمل يُجهّز بدعوة وصلاحيات مناسبة عند الحاجة.

## معاينة الويب على الكمبيوتر

```sh
npm ci
cp .env.example .env
npm run dev
```

ملء `.env` اختياري للواجهات التجريبية. عند تجهيز Firebase نسجّل تطبيقاً للحصول على إعدادات JavaScript SDK ونملأ المتغيرات الست. لا نستخدم Admin SDK في العميل. قيم EXPO_PUBLIC تُضمّن في التطبيق؛ الحماية تعتمد على القواعد. إضافة القيم لا تنشئ قواعد الأمان أو وظائف الحذف.

`npm start` يشغّل Vite والويب. خطوات iPhone ليست جاهزة بعد؛ لا نفترض أن Expo Go الحالي يدعم SDK 51 بالمستودع. سنجهّز بناء تطوير متوافق ومدخل Native وتخزين الجلسة ثم نوثق أمر البناء المجرب.

## عمل المطور التالي

- تجهيز مدخل iOS والاعتماديات والبناء مع الحفاظ على معاينة الويب.
- تثبيت bundleIdentifier بعد تحديد الحساب المالك.
- ربط بيئة Firebase للتطوير، تخزين الجلسة وقواعد الوصول.
- اختبار الكاميرا على الجهاز، ثم تسجيل الدخول، ثم نشر اللقطات.

## المراجع الرسمية

- [Expo: إعداد البيئة](https://docs.expo.dev/get-started/set-up-your-environment/)
- [Expo: بناء التطوير](https://docs.expo.dev/develop/development-builds/introduction/)
- [Firebase: إعداد JavaScript SDK](https://firebase.google.com/docs/web/setup)
- [Apple: التسجيل في برنامج المطور](https://developer.apple.com/programs/enroll/)

التسجيل المجاني لدى Apple يختلف عن عضوية Developer Program المستخدمة للتوزيع وTestFlight؛ نحدد توقيت تجهيزها مع مسار البناء.
