import { describe, expect, it } from "vitest";
import {
  formatOrientationDateText,
  getNextWorkStartDate,
  getOrientationDate,
} from "../../lib/orientationDate";

describe("orientationDate", () => {
  it("shows the first cycle before the anchor work-start day", () => {
    const today = new Date(2026, 6, 12);
    expect(getNextWorkStartDate(today).getDate()).toBe(13);
    expect(getOrientationDate(today).getDate()).toBe(11);
    expect(formatOrientationDateText(today)).toBe(
      "Saturday, 11th July 2026 work starts 13th july 8am",
    );
  });

  it("advances to the next week once the work-start day is reached", () => {
    const today = new Date(2026, 6, 13);
    expect(getNextWorkStartDate(today).getDate()).toBe(20);
    expect(getOrientationDate(today).getDate()).toBe(18);
    expect(formatOrientationDateText(today)).toBe(
      "Saturday, 18th July 2026 work starts 20th july 8am",
    );
  });

  it("advances again when the next work-start day is reached", () => {
    const today = new Date(2026, 6, 20);
    expect(getNextWorkStartDate(today).getDate()).toBe(27);
    expect(formatOrientationDateText(today)).toBe(
      "Saturday, 25th July 2026 work starts 27th july 8am",
    );
  });
});
