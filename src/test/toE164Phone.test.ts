import { describe, expect, it } from "vitest";
import { toE164Phone } from "@/lib/tiktok";

describe("toE164Phone", () => {
  it("formats 07 numbers", () => {
    expect(toE164Phone("0712345678")).toBe("+254712345678");
    expect(toE164Phone("07 123 456 78")).toBe("+254712345678");
  });

  it("formats 0115 numbers", () => {
    expect(toE164Phone("0115456789")).toBe("+254115456789");
    expect(toE164Phone("0115 456 789")).toBe("+254115456789");
  });

  it("keeps +2547 and +254115", () => {
    expect(toE164Phone("+254712345678")).toBe("+254712345678");
    expect(toE164Phone("+254115456789")).toBe("+254115456789");
  });

  it("formats 254 without plus", () => {
    expect(toE164Phone("254712345678")).toBe("+254712345678");
    expect(toE164Phone("254115456789")).toBe("+254115456789");
  });

  it("formats bare national numbers", () => {
    expect(toE164Phone("712345678")).toBe("+254712345678");
    expect(toE164Phone("115456789")).toBe("+254115456789");
  });

  it("rejects invalid placeholders", () => {
    expect(toE164Phone("null")).toBeUndefined();
    expect(toE164Phone("123-456-7890")).toBeUndefined();
    expect(toE164Phone("")).toBeUndefined();
  });
});
