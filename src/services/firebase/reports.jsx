import { doc, getDoc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import { normalizeReportInput, reportDocumentId, validateReportInput } from './reportModel';

export async function createReport(user, profile, input) {
  if (!user?.uid) throw Object.assign(new Error('Sign in required'), { code: 'report/sign-in-required' });
  const value = normalizeReportInput(input);
  const validation = validateReportInput(value, user.uid);
  if (validation) throw Object.assign(new Error(validation), { code: validation });
  const reportRef = doc(db, 'reports', reportDocumentId(user.uid, value.targetType, value.targetId));
  await runTransaction(db, async (transaction) => {
    const existing = await transaction.get(reportRef);
    if (existing.exists()) throw Object.assign(new Error('Already reported'), { code: 'report/already-exists' });
    transaction.set(reportRef, {
      reporterUid: user.uid,
      reporterName: profile?.displayName || 'مستخدم LilShot',
      reporterUsername: profile?.usernameLower || profile?.username || '',
      ...value,
      status: 'pending',
      resolution: '',
      reviewedAt: null,
      reviewedByUid: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
  return (await getDoc(reportRef)).id;
}
