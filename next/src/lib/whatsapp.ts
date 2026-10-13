import { site } from '@/content/site';

/**
 * Build a wa.me deep link to the provided business WhatsApp number,
 * optionally with a prefilled message.
 */
export function waLink(message?: string): string {
  const base = `https://wa.me/${site.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * Open the business WhatsApp chat: new tab when allowed, same tab as a
 * fallback when the popup is blocked, so the visitor always reaches us.
 */
export function openWhatsApp(message?: string): void {
  const url = waLink(message);
  const win = window.open(url, '_blank');
  if (win) {
    try {
      win.opener = null;
    } catch {
      /* best-effort hardening; ignore */
    }
  } else {
    window.location.assign(url);
  }
}