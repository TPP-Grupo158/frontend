import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";

import { usePatientHistory } from "@hooks/usePatientHistory";
import { internalFetch } from "@hooks/helpers";

vi.mock("@hooks/helpers", async () => {
  const actual = await vi.importActual("@hooks/helpers");
  return {
    ...actual,
    internalFetch: vi.fn(),
  };
});

const mockedInternalFetch = vi.mocked(internalFetch);

describe("usePatientHistory", () => {
  beforeEach(() => {
    mockedInternalFetch.mockReset();
  });

  it("uses patientId when fetching the history", async () => {
    mockedInternalFetch.mockImplementation(async (_m, _u, _b, onSuccess) => {
      onSuccess({ data: [{ id: 1 }], metadata: { has_next: true }});
      return { 
        data: { data: [{ id: 1 }], metadata: { has_next: true }},
        response: { ok: true, status: 200 } 
      };
    });

    const { result } = renderHook(() => usePatientHistory("123"));

    await act(async () => {
      await result.current.fetchHistory({ page: 1, limit: 10 });
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(mockedInternalFetch).toHaveBeenCalledWith(
      "GET",
      "/history/patient/123?page=1&limit=10",
      null,
      expect.any(Function),
      expect.any(Function)
    );
  });

  it("sets patient history on success", async () => {
    mockedInternalFetch.mockImplementation(async (_m, _u, _b, onSuccess) => {
      onSuccess({ data: [{ id: 1 }], metadata: { has_next: true } });
      return {
        data: { data: [{ id: 1 }], metadata: { has_next: true } },
        response: { ok: true, status: 200 },
      };
    });

    const { result } = renderHook(() => usePatientHistory("123"));

    await act(async () => {
      await result.current.fetchHistory({ page: 2, limit: 5 });
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.history).toEqual([{ id: 1 }]);
    expect(result.current.error).toEqual({ message: "", status_code: null });
  });

  it("sets hasMorePages on success", async () => {
    mockedInternalFetch.mockImplementation(async (_m, _u, _b, onSuccess) => {
      onSuccess({ data: [{ id: 1 }], metadata: { has_next: true } });
      return {
        data: { data: [{ id: 1 }], metadata: { has_next: true } },
        response: { ok: true, status: 200 },
      };
    });

    const { result } = renderHook(() => usePatientHistory("123"));

    await act(async () => {
      await result.current.fetchHistory({ page: 2, limit: 5 });
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.hasMorePages).toBe(true);
  });

  it("clears error on success", async () => {
    mockedInternalFetch.mockImplementation(async (_m, _u, _b, onSuccess) => {
      onSuccess({ data: [{ id: 1 }], metadata: { has_next: true } });
      return {
        data: { data: [{ id: 1 }], metadata: { has_next: true } },
        response: { ok: true, status: 200 },
      };
    });

    const { result } = renderHook(() => usePatientHistory("123"));

    // Mock fetch returns error once
    mockedInternalFetch.mockImplementationOnce(async (_m, _u, _b, _onSuccess, onFailure) => {
      const response = { ok: false, status: 404 };
      const data = { message: "Not found" };
      onFailure(data, response);
      return { data, response };
    });

    await act(async () => {
      await result.current.fetchHistory();
    });

    await waitFor(() => expect(result.current.error).toEqual({ message: "Not found", status_code: 404 }));

    // Now run success to clear it
    await act(async () => {
      await result.current.fetchHistory();
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toEqual({ message: "", status_code: null });
  });

  it("sets error message on failure", async () => {
    mockedInternalFetch.mockImplementation(async (_m, _u, _b, _onSuccess, onFailure) => {
      const response = { ok: false, status: 404 };
      const data = { message: "Not found" };
      onFailure(data, response);
      return { data, response };
    });

    const { result } = renderHook(() => usePatientHistory("123"));

    await act(async () => {
      await result.current.fetchHistory();
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toEqual({ message: "Not found", status_code: 404 });
  });
});