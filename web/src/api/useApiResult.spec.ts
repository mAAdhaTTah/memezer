import { waitFor } from "@testing-library/react";
import { Response } from "miragejs";
import { object, boolean, StructError } from "superstruct";
import { shared } from "../config";
import { renderHook } from "../testing";
import { useApiResult } from "./useApiResult";

const ResponseModel = object({
  success: boolean(),
});

const DUMMY_ROUTE = "/dummy";
const DUMMY_KEY = shared.API_BASE + DUMMY_ROUTE;

describe("useApiResult", () => {
  it("should transition from loading -> success on successful API call", async () => {
    server.get(DUMMY_ROUTE, () => ({
      success: true,
    }));
    const { result } = renderHook(() => useApiResult(DUMMY_KEY, ResponseModel));

    expect(result.current).toEqual({
      type: "loading",
    });
    await waitFor(() =>
      expect(result.current).toEqual({
        type: "success",
        data: {
          success: true,
        },
      })
    );
  });

  it("should return AxiosError if API errors", async () => {
    server.get(
      DUMMY_ROUTE,
      () => new Response(500, {}, { message: "Server is down" })
    );

    const { result } = renderHook(() => useApiResult(DUMMY_KEY, ResponseModel));

    await waitFor(() =>
      expect(result.current).toEqual({
        type: "error",
        error: expect.objectContaining({
          isAxiosError: true,
        }),
      })
    );
  });

  it("should return StructError is API returns incorrect type", async () => {
    server.get(DUMMY_ROUTE, () => ({
      success: "yes",
    }));

    const { result } = renderHook(() => useApiResult(DUMMY_KEY, ResponseModel));

    await waitFor(() =>
      expect(result.current).toEqual({
        type: "error",
        error: expect.any(StructError),
      })
    );
  });
});
