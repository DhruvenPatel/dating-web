// Remembers when the next OTP resend is allowed, so a page refresh
// does not reset the 60 second countdown.
export const OTP_COOLDOWN_SECONDS = 60;

const key = (email: string) => `vipx-otp-cooldown:${email.toLowerCase()}`;

export function startOtpCooldown(email: string, seconds = OTP_COOLDOWN_SECONDS) {
  sessionStorage.setItem(key(email), String(Date.now() + seconds * 1000));
}

export function getOtpCooldownRemaining(email: string): number {
  const until = Number(sessionStorage.getItem(key(email)) ?? 0);
  return Math.max(0, Math.ceil((until - Date.now()) / 1000));
}