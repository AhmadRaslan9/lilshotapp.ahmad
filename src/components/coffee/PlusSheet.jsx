import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { coffee as c } from '../../theme/coffee';
import { Sheet, Pill, Button, ui } from './Kit';
export default function PlusSheet({ visible, onClose, partner }) {
  const [period, setPeriod] = useState('monthly');
  const features = partner ? [['storefront-outline','صفحة تحكي قصة مقهاك','صور المكان والمنيو والأسعار في مكان واحد.'],['location-outline','خلك قريب من عشّاق القهوة','ظهور في اكتشاف المقاهي، مع التقييمات والمتابعين.'],['shield-checkmark-outline','حساب معتمد بعد التحقق','مراجعة ملكية النشاط قبل تفعيل اشتراك المقهى.']] : [['time-outline','خلّ اللحظة تعيش أطول','لقطات تبقى 24 ساعة بدل 8 ساعات.'],['images-outline','من الاستديو، أو من اللحظة','صوّر الآن أو اختَر صورة تحبها.'],['grid-outline','بعض اللحظات تستاهل تبقى','بوستات دائمة أثناء اشتراكك، بتصميم مميّز.'],['musical-notes-outline','إحساس للصورة','مقاطع حتى 30 ثانية بعد توفير مكتبة مرخّصة.'],['sparkles-outline','لمسة Plus','شارة اشتراك ومضاعف نقاط؛ التفاصيل النهائية عند الإطلاق.']];
  return <Sheet visible={visible} onClose={onClose} title={partner ? 'LilShot للمقاهي' : 'lilshot plus ✦'}>
    <Text style={[ui.title,{ fontSize:32 }]}>{partner ? 'مقهاك، جزء من الحكاية.' : 'لحظاتك الحلوة،\nتستاهل أكثر.'}</Text>
    <View style={ui.row}><Pill label="شهري" active={period === 'monthly'} onPress={() => setPeriod('monthly')} /><Pill label="سنوي" active={period === 'yearly'} onPress={() => setPeriod('yearly')} /></View>
    {features.map(([icon,title,desc]) => <View key={icon} style={[ui.row,{ alignItems:'flex-start' }]}><Ionicons name={icon} size={23} color={c.green} /><View style={{ flex:1,gap:5 }}><Text style={[ui.heading,{ fontSize:16 }]}>{title}</Text><Text style={ui.subtitle}>{desc}</Text></View></View>)}
    <View style={ui.panel}><Text style={ui.heading}>{period === 'monthly' ? 'اشتراك شهري' : 'اشتراك سنوي'}</Text><Text style={ui.subtitle}>الاشتراكات لم تُفتح بعد. السعر النهائي سيظهر قبل الشراء عند الإطلاق.</Text><Button label="قريباً" disabled /></View>
    <Text style={ui.subtitle}>{partner ? 'الاشتراك إلزامي للمقهى. سياسة مهلة التجديد تُعرض قبل الاشتراك.' : 'عند انتهاء Plus يعود الحساب عادياً وتُخفى البوستات حتى التجديد. شارة Plus تدل على الاشتراك.'}</Text>
  </Sheet>;
}
