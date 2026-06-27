import { afterEach, expect, test, vi } from "vitest";
import { trackEvent } from "@/lib/analytics";

afterEach(() => {
  delete window.va;
  delete window.gtag;
  delete window.dataLayer;
  vi.restoreAllMocks();
});

test("trackEvent is safe without analytics providers", () => {
  vi.spyOn(console, "debug").mockImplementation(() => {});

  expect(() => trackEvent("scan_started", { source: "photo" })).not.toThrow();
});

test("trackEvent forwards safe payloads to configured providers", () => {
  const va = vi.fn();
  const gtag = vi.fn();
  window.va = va;
  window.gtag = gtag;
  window.dataLayer = [];
  vi.spyOn(console, "debug").mockImplementation(() => {});

  trackEvent("checkin_saved", { strain_id: "blue-dream", rating: 5 });

  expect(va).toHaveBeenCalledWith("event", "checkin_saved", expect.objectContaining({
    strain_id: "blue-dream",
    rating: 5,
    path: "/",
  }));
  expect(gtag).toHaveBeenCalledWith("event", "checkin_saved", expect.objectContaining({
    strain_id: "blue-dream",
    rating: 5,
    path: "/",
  }));
  expect(window.dataLayer).toContainEqual(expect.objectContaining({
    event: "checkin_saved",
    strain_id: "blue-dream",
    rating: 5,
    path: "/",
  }));
});
