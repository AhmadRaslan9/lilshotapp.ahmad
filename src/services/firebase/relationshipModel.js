export function canFollowProfile(actorUid, target) {
  if (!actorUid || !target?.uid || actorUid === target.uid) return false;
  return target.privacy === 'public' && target.accountStatus === 'active';
}

export function canRequestFollowProfile(actorUid, target) {
  if (!actorUid || !target?.uid || actorUid === target.uid) return false;
  return target.privacy === 'private' && target.accountStatus === 'active';
}

export function relationshipErrorMessage(error) {
  if (error?.code === 'permission-denied') return 'لا يمكن متابعة هذا الحساب الآن.';
  if (error?.code === 'relationship/invalid-target') return 'هذا الحساب غير متاح للمتابعة.';
  if (error?.code === 'relationship/request-exists') return 'طلب المتابعة مُرسل بالفعل.';
  if (error?.code === 'relationship/request-missing') return 'طلب المتابعة لم يعد موجودًا.';
  return 'تعذّر تحديث المتابعة. تحقق من الاتصال وجرّب مجدداً.';
}
