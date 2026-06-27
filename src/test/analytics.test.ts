import { afterEach, expect, test, vi } from "vitest";
import { trackEvent } from "@/lib/analytics";
import { track } from "@vercel/analytics";

vi.mock("@vercel/analytics", () => ({
  track: vi.fn(),
}));

afterEach(() => {
  delete window.gtag;
  delete window.dataLayer;
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

test("trackEvent is safe without analytics providers", () => {
  vi.spyOn(console, "debug").mockImplementation(() => {});

  expect(() => trackEvent("scan_started", { source: "photo" })).not.toThrow();
});

test("trackEvent forwards safe payloads to configured providers", () => {
  const gtag = vi.fn();
  window.gtag = gtag;
  window.dataLayer = [];
  vi.spyOn(console, "debug").mockImplementation(() => {});

  trackEvent("checkin_saved", { strain_id: "blue-dream", rating: 5 });

  expect(track).toHaveBeenCalledWith("checkin_saved", expect.objectContaining({
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
