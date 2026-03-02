export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER || "03026943399").trim();
export const WHATSAPP_COUNTRY_CODE = (import.meta.env.VITE_WHATSAPP_CC || "+92").trim();
const RAW_SITE_URL = (import.meta.env.VITE_SITE_URL || "").trim();
export const SITE_URL = (() => {
  if (!RAW_SITE_URL) return "";
  const hasProto = /^https?:\/\//i.test(RAW_SITE_URL);
  const base = hasProto ? RAW_SITE_URL : `https://${RAW_SITE_URL}`;
  return base.replace(/\/+$/, "");
})();
