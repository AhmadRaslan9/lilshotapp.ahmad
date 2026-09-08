export const REPORT_REASONS = [
  { id: 'spam', label: 'محتوى مزعج أو متكرر' },
  { id: 'inappropriate', label: 'محتوى غير مناسب' },
  { id: 'impersonation', label: 'انتحال شخصية' },
  { id: 'harassment', label: 'إساءة أو مضايقة' },
  { id: 'other', label: 'سبب آخر' },
];

export const REPORT_TARGET_TYPES = ['account', 'cafe', 'post', 'moment'];

export function reportDocumentId(reporterUid, targetType, targetId) {
  return `${String(reporterUid || '').trim()}_${String(targetType || '').trim()}_${String(targetId || '').trim()}`;
}

export function normalizeReportInput(input = {}) {
  return {
    targetType: String(input.targetType || '').trim(),
    targetId: String(input.targetId || '').trim(),
    targetOwnerUid: String(input.targetOwnerUid || '').trim(),
    targetLabel: String(input.targetLabel || '').trim().slice(0, 120),
    targetPreview: String(input.targetPreview || '').trim().slice(0, 1000),
    reason: String(input.reason || '').trim(),
    details: String(input.details || '').trim().slice(0, 300),
  };
}

export function validateReportInput(input = {}, reporterUid = '') {
  const value = normalizeReportInput(input);
  if (!REPORT_TARGET_TYPES.includes(value.targetType)) return 'report/invalid-target-type';
  if (!value.targetId || !value.targetOwnerUid) return 'report/invalid-target';
  if (value.targetOwnerUid === reporterUid) return 'report/own-content';
  if (!REPORT_REASONS.some((item) => item.id === value.reason)) return 'report/invalid-reason';
  return null;
}

export function reportErrorMessage(error) {
  const code = typeof error === 'string' ? error : error?.code;
  if (code === 'report/already-exists') return 'سبق وأرسلت بلاغًا عن هذا العنصر.';
  if (code === 'report/own-content') return 'لا يمكنك التبليغ عن محتواك.';
  if (code === 'report/invalid-reason') return 'اختر سبب البلاغ.';
  if (code === 'permission-denied') return 'تعذّر إرسال البلاغ. تأكد من نشر قواعد Firestore الجديدة.';
  return 'تعذّر إرسال البلاغ الآن. حاول مرة أخرى.';
}
