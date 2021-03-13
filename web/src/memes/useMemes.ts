import { useCallback } from "react";
import { shared } from "../config";
import { useApiResult, useClient } from "../api";
import { MemeListView } from "./schemas";

const MEME_URL = `${shared.API_BASE}/memes`;

export const useMemes = () => {
  const { api } = useClient();
  const { result, mutate } = useApiResult(MEME_URL, MemeListView);

  const uploadMeme = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post(MEME_URL, formData);

      mutate([
        ...(result.type === "success" ? result.data : []),
        response.data,
      ]);
    },
    [api, mutate, result]
  );

  return { result, uploadMeme };
};
