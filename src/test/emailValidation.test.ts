import { describe, expect, it } from "vitest";
import { getEmailDomain, isKnownEmailProvider, isValidEmail, validateEmail } from "@/lib/emailValidation";

describe("getEmailDomain", () => {
  it("extracts the domain from a valid email", () => {
    expect(getEmailDomain("user@gmail.com")).toBe("gmail.com");
  });
});

describe("isKnownEmailProvider", () => {
  it("recognises major providers", () => {
    expect(isKnownEmailProvider("gmail.com")).toBe(true);
    expect(isKnownEmailProvider("quickmart.co.ke")).toBe(false);
  });
});

describe("validateEmail", () => {
  it("accepts well-formed common provider addresses", () => {
    expect(validateEmail("user@gmail.com")).toEqual({ valid: true, formatValid: true });
    expect(validateEmail("user@yahoo.co.ke")).toEqual({ valid: true, formatValid: true });
  });

  it("rejects invalid format", () => {
    const result = validateEmail("not-an-email");
    expect(result.valid).toBe(false);
    expect(result.formatValid).toBe(false);
  });

  it("flags common gmail typos with a suggestion", () => {
    const result = validateEmail("john@gmal.com");
    expect(result.valid).toBe(false);
    expect(result.formatValid).toBe(true);
    expect(result.suggestion).toBe("john@gmail.com");
  });

  it("flags one-character domain typos", () => {
    const result = validateEmail("jane@gmali.com");
    expect(result.valid).toBe(false);
    expect(result.suggestion).toBe("jane@gmail.com");
  });

  it("allows custom business domains", () => {
    expect(validateEmail("hr@quickmart.co.ke").valid).toBe(true);
  });
});

describe("isValidEmail", () => {
  it("returns true only for valid addresses", () => {
    expect(isValidEmail("user@gmail.com")).toBe(true);
    expect(isValidEmail("user@gmal.com")).toBe(false);
  });
});
