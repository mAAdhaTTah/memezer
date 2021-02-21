import { waitFor } from "@testing-library/react";
import { renderHook, setupServerInTests } from "../testing";
import { useMemes } from "./useMemes";

describe("useMemes", () => {
  setupServerInTests();

  it("should fetch an empty list of memes", async () => {
    const { result } = renderHook(() => useMemes());

    await waitFor(() =>
      expect(result.current).toEqual({
        result: {
          type: "success",
          data: [],
        },
      })
    );
  });

  it("should fetch the seeded meme", async () => {
    const meme = server.create("meme");

    const { result } = renderHook(() => useMemes());

    await waitFor(() =>
      expect(result.current).toEqual({
        result: {
          type: "success",
          data: [
            {
              id: meme.id,
              title: meme.title,
              filename: meme.filename,
            },
          ],
        },
      })
    );
  });
});
