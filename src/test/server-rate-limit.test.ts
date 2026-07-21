import { beforeEach, describe, expect, it } from "vitest";
import {
  clearRateLimitsForTests,
  consumeRateLimit,
  getClientIdentifier,
} from "@/lib/server-rate-limit";

describe("server rate limiting", () => {
  beforeEach(() => clearRateLimitsForTests());

  it("allows requests until the limit and then blocks", () => {
    const first = consumeRateLimit({
      namespace: "scan",
      key: "visitor",
      limit: 2,
      windowMs: 1_000,
      now: 10_000,
    });
    const second = consumeRateLimit({
      namespace: "scan",
      key: "visitor",
      limit: 2,
      windowMs: 1_000,
      now: 10_100,
    });
    const third = consumeRateLimit({
      namespace: "scan",
      key: "visitor",
      limit: 2,
      windowMs: 1_000,
      now: 10_200,
    });

    expect(first).toMatchObject({ allowed: true, remaining: 1 });
    expect(second).toMatchObject({ allowed: true, remaining: 0 });
    expect(third).toMatchObject({ allowed: false, remaining: 0 });
    expect(third.retryAfterSeconds).toBe(1);
  });

  it("starts a fresh window after reset", () => {
    consumeRateLimit({
      namespace: "chat",
      key: "visitor",
      limit: 1,
      windowMs: 1_000,
      now: 5_000,
    });

    const nextWindow = consumeRateLimit({
      namespace: "chat",
      key: "visitor",
      limit: 1,
      windowMs: 1_000,
      now: 6_001,
    });

    expect(nextWindow).toMatchObject({ allowed: true, remaining: 0, resetAt: 7_001 });
  });

  it("uses the first forwarded address", () => {
    const headers = new Headers({
      "x-forwarded-for": "203.0.113.7, 10.0.0.1",
      "x-real-ip": "198.51.100.2",
    });

    expect(getClientIdentifier(headers)).toBe("203.0.113.7");
  });
});
