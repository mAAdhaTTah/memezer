import { act } from "@testing-library/react-hooks/dom";
import { chance, renderHook, setupServerInTests } from "../testing";
import { useMemes } from "./useMemes";

describe("useMemes", () => {
  setupServerInTests();

  it("should fetch an empty list of memes", async () => {
    const { result, waitFor } = renderHook(() => useMemes());

    await waitFor(() =>
      expect(result.current).toEqual({
        result: {
          type: "success",
          data: { total: 0, size: 50, page: 0, items: [] },
        },
        uploadMeme: expect.any(Function),
        deleteMeme: expect.any(Function),
      })
    );
  });

  it("should fetch the seeded meme", async () => {
    const meme = server.create("meme");

    const { result, waitFor } = renderHook(() => useMemes());

    await waitFor(() =>
      expect(result.current).toEqual({
        result: {
          type: "success",
          data: {
            total: 1,
            size: 50,
            page: 0,
            items: [
              {
                id: meme.id,
                title: meme.title,
                filename: meme.filename,
                file_url: meme.file_url,
                uploaded_at: expect.any(Date),
                accessibility_text: null,
              },
            ],
          },
        },
        uploadMeme: expect.any(Function),
        deleteMeme: expect.any(Function),
      })
    );
  });

  it("should upload meme successfully", async () => {
    const filename = `${chance.hash()}.png`;
    const { result, waitFor } = renderHook(() => useMemes());

    await waitFor(() =>
      expect(result.current).toEqual({
        result: {
          type: "success",
          data: { total: 0, size: 50, page: 0, items: [] },
        },
        uploadMeme: expect.any(Function),
        deleteMeme: expect.any(Function),
      })
    );

    await act(async () => {
      await result.current.uploadMeme(new File([], filename));
    });

    const data = server.schema.all("meme").models;
    expect(data).toHaveLength(1);

    const [meme] = data;

    const statuses: string[] = [];

    await waitFor(() => {
      statuses.push(result.current.result.type);
      expect(result.current).toEqual({
        result: {
          type: "success",
          data: {
            total: 1,
            size: 50,
            page: 0,
            items: [
              {
                id: meme.id,
                title: filename,
                filename,
                file_url: meme.file_url,
                uploaded_at: expect.any(Date),
                accessibility_text: null,
              },
            ],
          },
        },
        uploadMeme: expect.any(Function),
        deleteMeme: expect.any(Function),
      });

      // Should never transition to an error state.
      expect(statuses).not.toContain("error");
    });
  });
});
