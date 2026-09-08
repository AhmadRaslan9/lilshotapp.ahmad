export function notificationText(notification = {}) {
  const name = notification.actorName || 'مستخدم LilShot';
  if (notification.type === 'follow') return `${name} بدأ بمتابعتك`;
  if (notification.type === 'follow_request') return `${name} أرسل لك طلب متابعة`;
  if (notification.type === 'follow_accepted') return `${name} وافق على طلب متابعتك`;
  if (notification.type === 'like') return `${name} أعجب بمنشورك`;
  return 'لديك إشعار جديد';
}

export function notificationIcon(type) {
  return type === 'like' ? 'heart' : type === 'follow_accepted' ? 'checkmark-circle' : ['follow', 'follow_request'].includes(type) ? 'person-add' : 'notifications';
}

export function toNotification(id, data = {}) {
  return {
    id,
    type: data.type || 'unknown',
    actorUid: data.actorUid || '',
    actorName: data.actorName || '',
    actorUsername: data.actorUsername || '',
    targetUid: data.targetUid || '',
    postId: data.postId || '',
    read: Boolean(data.read),
    createdAtMs: data.createdAt?.toMillis?.() || 0,
  };
}
