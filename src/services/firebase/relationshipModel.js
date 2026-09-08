export function canFollowProfile(actorUid, target) {
  if (!actorUid || !target?.uid || actorUid === target.uid) return false;
  return target.privacy === 'public' && target.accountStatus === 'active';
}

export function relationshipErrorMessage(error) {
  if (error?.code === 'permission-denied') return 'لا يمكن متابعة هذا الحساب الآن.';
  if (error?.code === 'relationship/invalid-target') return 'هذا الحساب غير متاح للمتابعة.';
  return 'تعذّر تحديث المتابعة. تحقق من الاتصال وجرّب مجدداً.';
}
