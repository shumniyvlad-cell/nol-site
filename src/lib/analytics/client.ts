"use client";

type AnalyticsValue = string | number | boolean | null | undefined;
type AnalyticsPayload = Record<string, AnalyticsValue>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, AnalyticsValue>>;
  }
}

export function trackEvent(
  event: string,
  payload: AnalyticsPayload = {},
) {
  if (typeof window === "undefined") {
    return;
  }

  const detail = { event, ...payload };
  window.dataLayer?.push(detail);
  window.dispatchEvent(
    new CustomEvent("nol:analytics", {
      detail,
    }),
  );
}
