import { useCallback } from "react";
import { useApiResult, useClient } from "../api";
import { MemeCollectionView } from "./schemas";
import { MEME_URL } from "./constants";

type MemeParams = {
  term?: string;
  page?: number;
  size?: number;
};

export const useMemes = (params: MemeParams = {}) => {
  const { api } = useClient();
  const { result, mutate } = useApiResult(
    // @ts-expect-error search params works w/ a number but TS whines
    `${MEME_URL}?${new URLSearchParams(params)}`,
    MemeCollectionView
  );

  const uploadMeme = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post(MEME_URL, formData);

      mutate({
        ...(result.type === "success"
          ? result.data
          : { total: 1, page: 0, size: 1 }),
        items: [
          response.data,
          ...(result.type === "success" ? result.data.items : []),
        ],
      });
    },
    [api, mutate, result]
  );

  return { result, uploadMeme };
};
