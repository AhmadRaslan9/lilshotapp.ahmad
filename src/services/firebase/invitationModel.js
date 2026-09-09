export const INVITE_LIMIT = 3;
export const normalizeInviteCode = (value = '') => value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
export function createInviteCode(uid, slot, random = Math.random) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 6; i += 1) suffix += alphabet[Math.floor(random() * alphabet.length) % alphabet.length];
  return `LIL${slot}-${suffix}-${String(uid).slice(0, 3).toUpperCase()}`;
}
export function inviteStatusLabel(status) {
  return status === 'used' ? 'مستخدمة' : status === 'revoked' ? 'ملغاة' : 'متاحة';
}
