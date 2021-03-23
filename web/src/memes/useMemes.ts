import { useCallback } from "react";
import { useApiResult, useClient } from "../api";
import { MemeListView } from "./schemas";
import { MEME_URL } from "./constants";

type SearchOptions = {
  term?: string;
};

export const useMemes = ({ term }: SearchOptions = {}) => {
  const { api } = useClient();
  const { result, mutate } = useApiResult(
    `${MEME_URL}${term ? `?term=${encodeURIComponent(term)}` : ""}`,
    MemeListView
  );

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
