import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { coffee as c } from '../../theme/coffee';
const authMessage = error => {
  const code = error?.code || '';
  if (/invalid-credential|wrong-password|user-not-found/.test(code)) return 'البريد أو كلمة المرور غير صحيحة.';
  if (code.includes('email-already-in-use')) return 'هذا البريد مسجّل. ارجع لتسجيل الدخول.';
  if (code.includes('invalid-email')) return 'تأكد من كتابة البريد الإلكتروني بشكل صحيح.';
  if (code.includes('weak-password')) return 'اختَر كلمة مرور أقوى، من 6 أحرف على الأقل.';
  if (code.includes('network-request-failed')) return 'تعذّر الاتصال. تأكد من الإنترنت وجرّب مرة ثانية.';
  if (code.includes('too-many-requests')) return 'محاولات كثيرة. انتظر قليلاً ثم جرّب.';
  return 'تعذّرت العملية الآن. جرّب مرة أخرى.';
};
export default function AccountForm({ mode, onCancel, onSwitch }) {
  const signup = mode === 'signup';
  const submitBusy = useRef(false);
  const { signIn, signUp } = useAuth();
  const [email,setEmail]=useState('');
  const [name,setName]=useState('');
  const [password,setPassword]=useState('');
  const [showPassword,setShowPassword]=useState(false);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const submit=async()=>{
    if(submitBusy.current) return;
    setError('');
    if(!email.trim() || !password || (signup && !name.trim())) {setError('عبّي الحقول المطلوبة أولاً.');return;}
    submitBusy.current = true;
    setBusy(true);
    try { if(signup) await signUp(email.trim(),password,name.trim()); else await signIn(email.trim(),password); }
    catch(err){setError(authMessage(err));} finally{submitBusy.current = false; setBusy(false);}
  };
  return <SafeAreaView style={s.page}><KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':undefined}><ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
    <View style={s.top}><TouchableOpacity onPress={onCancel} accessibilityRole="button" accessibilityLabel="العودة" style={s.back}><Ionicons name="arrow-forward" size={22} color={c.dark} /></TouchableOpacity><Text style={s.logo}>lilshot.</Text></View>
    <View style={s.intro}><Text style={s.eyebrow}>{signup?'YOUR NEXT LITTLE MOMENT':'GOOD TO SEE YOU AGAIN'}</Text><Text style={s.title}>{signup?'كل حكاية حلوة،\nتبدأ بلحظة.':'يا هلا برجعتك.\nقهوتك جاهزة؟'}</Text><Text style={s.subtitle}>{signup?'أنشئ حسابك وخلّ لحظاتك أقرب لأصحابك.':'سجّل دخولك وكمل حكايتك.'}</Text></View>
    <View style={s.apple} accessibilityRole="button" accessibilityState={{disabled:true}}><Ionicons name="logo-apple" size={23} color={c.dark} /><Text style={s.appleText}>تسجيل Apple · قريباً</Text></View>
    <View style={s.divider}><View style={s.line}/><Text style={s.or}>بالبريد الإلكتروني</Text><View style={s.line}/></View>
    {signup && <View style={s.field}><Text style={s.label}>اسمك</Text><TextInput value={name} onChangeText={setName} placeholder="كيف نناديك؟" accessibilityLabel="اسمك" placeholderTextColor="#93877E" style={[s.input,{textAlign:'right'}]} editable={!busy} autoComplete="name" /></View>}
    <View style={s.field}><Text style={s.label}>البريد الإلكتروني</Text><TextInput value={email} onChangeText={setEmail} placeholder="you@example.com" accessibilityLabel="البريد الإلكتروني" placeholderTextColor="#93877E" style={s.input} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" autoComplete="email" editable={!busy} /></View>
    <View style={s.field}><Text style={s.label}>كلمة المرور</Text><View style={s.password}><TextInput value={password} onChangeText={setPassword} placeholder={signup?'6 أحرف على الأقل':'كلمة المرور'} accessibilityLabel="كلمة المرور" placeholderTextColor="#93877E" secureTextEntry={!showPassword} style={[s.input,{flex:1,minWidth:0,backgroundColor:'transparent'}]} autoCapitalize="none" autoComplete={signup?'new-password':'current-password'} editable={!busy} onSubmitEditing={submit}/><TouchableOpacity onPress={()=>setShowPassword(!showPassword)} accessibilityRole="button" accessibilityLabel={showPassword?'إخفاء كلمة المرور':'إظهار كلمة المرور'} style={s.eye}><Ionicons name={showPassword?'eye-off-outline':'eye-outline'} size={20} color="#7C7068" /></TouchableOpacity></View></View>
    {error ? <Text accessibilityRole="alert" style={s.error}>{error}</Text>:null}
    <TouchableOpacity disabled={busy} onPress={submit} accessibilityRole="button" accessibilityState={{disabled:busy,busy}} style={s.submit}>{busy?<ActivityIndicator color={c.cream}/>:<Text style={s.submitText}>{signup?'إنشاء حساب':'تسجيل الدخول'}</Text>}</TouchableOpacity>
    <TouchableOpacity onPress={onSwitch} accessibilityRole="button" style={s.switch}><Text style={s.switchText}>{signup?'عندك حساب؟ تسجيل الدخول':'أول مرة؟ أنشئ حسابك'}</Text></TouchableOpacity>
    <Text style={s.footer}>قهوة تجمعنا، ولحظات تشبهنا.</Text>
  </ScrollView></KeyboardAvoidingView></SafeAreaView>;
}
const s=StyleSheet.create({page:{flex:1,backgroundColor:'#FAF8F4'},content:{padding:26,paddingBottom:36,gap:16,flexGrow:1},top:{flexDirection:'row-reverse',alignItems:'center',justifyContent:'space-between',marginTop:8},back:{width:44,height:44,borderRadius:22,backgroundColor:'#FFF',alignItems:'center',justifyContent:'center'},logo:{color:c.dark,fontSize:25,fontWeight:'800',letterSpacing:-1},intro:{marginTop:28,marginBottom:8,gap:12},eyebrow:{color:'#9C6544',fontSize:9,letterSpacing:1.5,textAlign:'right'},title:{fontSize:32,lineHeight:46,color:c.dark,fontWeight:'700',textAlign:'right'},subtitle:{fontSize:13,lineHeight:23,color:'#7C7068',textAlign:'right'},apple:{minHeight:54,backgroundColor:'#FFFFFF',borderRadius:18,flexDirection:'row-reverse',gap:10,justifyContent:'center',alignItems:'center',opacity:0.65},appleText:{color:c.dark,fontSize:14,fontWeight:'600'},divider:{flexDirection:'row',alignItems:'center',gap:12,marginVertical:3},line:{height:1,flex:1,backgroundColor:'#E8E1D8'},or:{fontSize:10,color:'#82766F'},field:{gap:7},label:{textAlign:'right',fontSize:11,color:'#6E5B4D'},input:{minHeight:53,borderRadius:17,backgroundColor:'#FFFFFF',paddingHorizontal:17,fontSize:15,color:c.dark,paddingVertical:13},password:{flexDirection:'row',alignItems:'center',backgroundColor:'#FFFFFF',borderRadius:17},eye:{width:48,height:48,alignItems:'center',justifyContent:'center'},error:{color:'#A23E35',fontSize:13,textAlign:'right',lineHeight:21},submit:{minHeight:55,borderRadius:28,backgroundColor:'#392C2C',alignItems:'center',justifyContent:'center',marginTop:7},submitText:{color:c.cream,fontSize:16,fontWeight:'700'},switch:{minHeight:44,alignItems:'center',justifyContent:'center'},switchText:{color:'#392C2C',fontSize:13,fontWeight:'600'},footer:{color:'#82766F',fontSize:10,textAlign:'center',marginTop:8}});
