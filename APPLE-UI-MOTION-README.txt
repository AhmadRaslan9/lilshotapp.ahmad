LilShot Apple UI + Motion + Fonts

هذه حزمة واجهة فقط. لا تغيّر Firebase أو package.json أو app.json أو إعدادات Expo/Vite.

المحتوى:
- تصميم Apple الهادئ السابق.
- حركات دخول وانتقال وضغط ناعمة باستخدام Animated الموجود في React Native.
- خط Kufam للعربية.
- خط Pacifico للعناوين الترحيبية والجمالية الإنجليزية فقط.
- إصلاح تبديل اللغة: يبقى ترتيب التطبيق ثابتاً ولا تنعكس الواجهة.

التثبيت فوق مشروعك الحالي:
1) ضع الملف المضغوط في Linux files.
2) افتح Terminal داخل مجلد المشروع.
3) نفّذ:
   git switch -c apple-ui-motion
   unzip -o ~/lilshot-apple-ui-motion-fonts.zip -d .
   npm run dev -- --force

لا تعمل push إلى main قبل تجربة الصفحات الأساسية.
