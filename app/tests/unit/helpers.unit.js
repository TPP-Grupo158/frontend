import { expect, describe, it } from "vitest";
import { sanitizeNameInput, getTimeFromToday } from "../../src/helpers";

describe('sanitizeNameInput', () => {
  it('should remove special characters from the name input', () => {
    const input = "John@Doe!#";
    const expectedOutput = "JohnDoe";
    expect(sanitizeNameInput(input)).toBe(expectedOutput);
  });

  it('should allow letters, spaces, apostrophes, periods, and hyphens', () => {
    const input = "O'Connor. Smith-Jones";
    const expectedOutput = "O'Connor. Smith-Jones";
    expect(sanitizeNameInput(input)).toBe(expectedOutput);
  });

  it('should return an empty string if the input contains only special characters', () => {
    const input = "@#$%^&*()";
    const expectedOutput = "";
    expect(sanitizeNameInput(input)).toBe(expectedOutput);
  });
});

describe('getTimeFromToday', () => {
  it('should return the current date in YYYY-MM-DD format', () => {
    const today = new Date();
    const expectedOutput = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    expect(getTimeFromToday()).toBe(expectedOutput);
  });

  it('should return the date with the specified years offset', () => {
    const yearsOffset = -5;
    const today = new Date();
    const expectedOutput = `${today.getFullYear() + yearsOffset}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    expect(getTimeFromToday(yearsOffset)).toBe(expectedOutput);
  });
});