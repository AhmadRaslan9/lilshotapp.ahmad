export function notificationText(notification = {}) {
  const name = notification.actorName || 'مستخدم LilShot';
  if (notification.type === 'follow') return `${name} بدأ بمتابعتك`;
  if (notification.type === 'like') return `${name} أعجب بمنشورك`;
  return 'لديك إشعار جديد';
}

export function notificationIcon(type) {
  return type === 'like' ? 'heart' : type === 'follow' ? 'person-add' : 'notifications';
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
