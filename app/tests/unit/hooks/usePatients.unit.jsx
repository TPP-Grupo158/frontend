import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";

import { usePatients } from "@hooks/usePatients";
import { internalFetch } from "@hooks/helpers";

vi.mock("@hooks/helpers", async () => {
  const actual = await vi.importActual("@hooks/helpers");
  return {
    ...actual,
    internalFetch: vi.fn(),
  };
});

const mockedInternalFetch = vi.mocked(internalFetch);

describe("usePatients", () => {
  beforeEach(() => {
    mockedInternalFetch.mockReset();
  });

  it("calls GET with DNI filter only", async () => {
  mockedInternalFetch.mockImplementation(async (_m, _u, _b, onSuccess) => {
    onSuccess({ patients: [], hasMore: false });
    return { data: { patients: [], hasMore: false }, response: { ok: true, status: 200 } };
  });

  const { result } = renderHook(() => usePatients());

  await act(async () => {
    await result.current.fetchPatients("123", "", 20, 5);
  });

  await waitFor(() => expect(result.current.loading).toBe(false));

  expect(mockedInternalFetch).toHaveBeenCalledWith(
    "GET",
    "patients?offset=20&limit=5&dni=123",
    null,
    expect.any(Function),
    expect.any(Function)
  );
  });

  it("calls GET with Name filter only", async () => {
    mockedInternalFetch.mockImplementation(async (_m, _u, _b, onSuccess) => {
      onSuccess({ patients: [], hasMore: false });
      return { data: { patients: [], hasMore: false }, response: { ok: true, status: 200 } };
    });

    const { result } = renderHook(() => usePatients());

    await act(async () => {
      await result.current.fetchPatients("", "Ana", 20, 5);
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(mockedInternalFetch).toHaveBeenCalledWith(
      "GET",
      "patients?offset=20&limit=5&name=Ana",
      null,
      expect.any(Function),
      expect.any(Function)
    );
  });

  it("calls GET with only offset and limit when no filters are provided", async () => {
    mockedInternalFetch.mockImplementation(async (_m, _u, _b, onSuccess) => {
      onSuccess({ patients: [], hasMore: false });
      return { data: { patients: [], hasMore: false }, response: { ok: true, status: 200 } };
    });

    const { result } = renderHook(() => usePatients());

    await act(async () => {
      await result.current.fetchPatients("", "", 20, 5);
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(mockedInternalFetch).toHaveBeenCalledWith(
      "GET",
      "patients?offset=20&limit=5",
      null,
      expect.any(Function),
      expect.any(Function)
    );
  });

  it("calls GET with DNI and Name filters when fetching patients", async () => {
    mockedInternalFetch.mockImplementation(async (_m, _u, _b, onSuccess) => {
      onSuccess({ patients: [], hasMore: false });
      return { data: { patients: [], hasMore: false }, response: { ok: true, status: 200 } };
    });

    const { result } = renderHook(() => usePatients());

    await act(async () => {
      await result.current.fetchPatients("123", "Ana", 20, 5);
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(mockedInternalFetch).toHaveBeenCalledWith(
      "GET",
      "patients?offset=20&limit=5&dni=123&name=Ana",
      null,
      expect.any(Function),
      expect.any(Function)
    );
  });

  it("sets patients and hasMorePages on success", async () => {
    mockedInternalFetch.mockImplementation(async (_m, _u, _b, onSuccess) => {
      onSuccess({ patients: [{ dni: "123" }], hasMore: true });
      return {
        data: { patients: [{ dni: "123" }], hasMore: true },
        response: { ok: true, status: 200 },
      };
    });

    const { result } = renderHook(() => usePatients());

    await act(async () => {
      await result.current.fetchPatients();
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.patients).toEqual([{ dni: "123" }]);
    expect(result.current.hasMorePages).toBe(true);
    expect(result.current.error).toEqual({ message: "", status_code: null });
  });

  it("sets error message on fetch failure", async () => {
    mockedInternalFetch.mockImplementation(async (_m, _u, _b, _onSuccess, onFailure) => {
      const response = { ok: false, status: 404 };
      const data = { message: "Not found" };
      onFailure(data, response);
      return { data, response };
    });

    const { result } = renderHook(() => usePatients());

    await act(async () => {
      await result.current.fetchPatients();
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toEqual({ message: "Not found", status_code: 404 });
  });

  it("creates patient and returns empty error on success", async () => {
    mockedInternalFetch.mockImplementation(async (_m, _u, _b, onSuccess) => {
      onSuccess({ message: "ok" });
      return { data: { message: "ok" }, response: { ok: true, status: 201 } };
    });

    const { result } = renderHook(() => usePatients());

    const response = await act(async () =>
      result.current.createPatient("Ana", "123", "ana@test.com", "2000-01-01")
    );

    expect(mockedInternalFetch).toHaveBeenCalledWith(
      "POST",
      "patients/",
      { fullname: "Ana", dni: "123", email: "ana@test.com", date_of_birth: "2000-01-01" },
      expect.any(Function),
      expect.any(Function)
    );

    expect(response).toEqual({ error: {} });
  });

  it("returns error object on create failure", async () => {
    mockedInternalFetch.mockImplementation(async (_m, _u, _b, _onSuccess, onFailure) => {
      const response = { ok: false, status: 400 };
      const data = { message: "Bad request" };
      onFailure(data, response);
      return { data, response };
    });

    const { result } = renderHook(() => usePatients());

    const response = await act(async () =>
      result.current.createPatient("Ana", "123", "ana@test.com", "2000-01-01")
    );

    expect(response).toEqual({
      error: { message: "Bad request", status_code: 400 },
    });
  });
}); 