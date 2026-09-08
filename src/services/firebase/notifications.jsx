import { collection, doc, limit, onSnapshot, orderBy, query, serverTimestamp, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from './config';
import { toNotification } from './notificationModel';

export function subscribeToNotifications(uid, next, error) {
  if (!uid || uid === 'demo-local') { next([]); return () => {}; }
  const notificationsQuery = query(collection(db, 'users', uid, 'notifications'), orderBy('createdAt', 'desc'), limit(50));
  return onSnapshot(notificationsQuery, (snap) => next(snap.docs.map((item) => toNotification(item.id, item.data()))), error);
}

export function markNotificationRead(uid, notificationId) {
  return updateDoc(doc(db, 'users', uid, 'notifications', notificationId), { read: true, readAt: serverTimestamp() });
}

export async function markAllNotificationsRead(uid, notifications) {
  const unread = notifications.filter((item) => !item.read).slice(0, 50);
  if (!uid || !unread.length) return;
  const batch = writeBatch(db);
  unread.forEach((item) => batch.update(doc(db, 'users', uid, 'notifications', item.id), { read: true, readAt: serverTimestamp() }));
  await batch.commit();
}
