"use client";

type AnalyticsValue = string | number | boolean | null | undefined;
export type AnalyticsProperties = Record<string, AnalyticsValue>;

type VercelAnalytics = (event: "event", name: string, properties?: AnalyticsProperties) => void;
type Gtag = (command: "event", name: string, properties?: AnalyticsProperties) => void;

declare global {
  interface Window {
    va?: VercelAnalytics;
    gtag?: Gtag;
    dataLayer?: unknown[];
  }
}

export function trackEvent(name: string, properties: AnalyticsProperties = {}) {
  if (typeof window === "undefined") return;

  const payload = {
    ...properties,
    path: window.location.pathname,
  };

  window.va?.("event", name, payload);
  window.gtag?.("event", name, payload);
  window.dataLayer?.push({ event: name, ...payload });

  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", name, payload);
  }
}
