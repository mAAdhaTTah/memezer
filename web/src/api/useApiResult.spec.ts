import { waitFor } from "@testing-library/react";
import { Response } from "miragejs";
import { object, boolean, StructError } from "superstruct";
import { renderHook } from "../testing";
import { useApiResult } from "./useApiResult";

const ResponseModel = object({
  success: boolean(),
});

const DUMMY_API = "/api/test";

describe("useApiResult", () => {
  it("should transition from loading -> success on successful API call", async () => {
    server.get(DUMMY_API, () => ({
      success: true,
    }));
    const { result } = renderHook(() => useApiResult(DUMMY_API, ResponseModel));

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
      DUMMY_API,
      () => new Response(500, {}, { message: "Server is down" })
    );

    const { result } = renderHook(() => useApiResult(DUMMY_API, ResponseModel));

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
    server.get(DUMMY_API, () => ({
      success: "yes",
    }));

    const { result } = renderHook(() => useApiResult(DUMMY_API, ResponseModel));

    await waitFor(() =>
      expect(result.current).toEqual({
        type: "error",
        error: expect.any(StructError),
      })
    );
  });
});
