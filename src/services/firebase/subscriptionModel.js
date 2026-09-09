export function subscriptionEndMillis(profile = {}) {
  const value = profile.subscriptionEndsAt;
  if (!value) return null;
  if (typeof value.toMillis === 'function') return value.toMillis();
  if (typeof value.seconds === 'number') return value.seconds * 1000;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}
export function hasActiveSubscription(profile = {}, now = Date.now()) {
  const end = subscriptionEndMillis(profile);
  return end === null || end > now;
}
export function subscriptionDaysLeft(profile = {}, now = Date.now()) {
  const end = subscriptionEndMillis(profile);
  return end === null ? null : Math.max(0, Math.ceil((end - now) / 86400000));
}
