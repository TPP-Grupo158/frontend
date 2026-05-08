import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from '@testing-library/react';

import { useDebounce } from "@hooks/useDebounce";

describe('useDebounce hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("updates state after delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 500 } }
    );

    expect(result.current).toBe("initial");

    rerender({ value: "updated", delay: 500 });
    expect(result.current).toBe("initial");

    act(() => vi.advanceTimersByTime(500));

    expect(result.current).toBe("updated");
  });

  it("uses the latest value if called again before delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 500 } }
    );

    rerender({ value: "first", delay: 500 });
    
    act(() => vi.advanceTimersByTime(300))
    rerender({ value: "second", delay: 500 });

    act(() => vi.advanceTimersByTime(300));
    expect(result.current).toBe("initial");

    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe("second");
  });
});