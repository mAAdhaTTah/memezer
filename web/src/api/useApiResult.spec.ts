import { waitFor } from "@testing-library/react";
import { renderHook as tlRenderHook } from "@testing-library/react-hooks";
import { createServer, Server, Response } from "miragejs";
import { object, boolean, StructError } from "superstruct";
import { cache } from "swr";
import { AppProvider } from "../app";
import { useApiResult } from "./useApiResult";

const renderHook = <P, R>(cb: (props: P) => R) =>
  tlRenderHook<P, R>(cb, {
    wrapper: AppProvider,
  });

const ResponseModel = object({
  success: boolean(),
});

const DUMMY_API = "/api/test";

describe("useApiResult", () => {
  let server: Server;

  beforeEach(() => {
    server = createServer({
      environment: "test",
      routes() {
        this.get(DUMMY_API, () => ({
          success: true,
        }));
      },
    });
  });

  afterEach(async () => {
    server?.shutdown();
    await waitFor(() => cache.clear());
  });

  it("should transition from loading -> success on successful API call", async () => {
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
