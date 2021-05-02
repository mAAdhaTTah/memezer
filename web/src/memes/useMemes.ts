import { useCallback } from "react";
import { mutate as globalMutate } from "swr";
import { useApiResult, useClient } from "../api";
import { MemeCollectionView, MemeView } from "./schemas";
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

      mutate(
        {
          ...(result.type === "success"
            ? {
                total: result.data.total + 1,
                page: result.data.page,
                size: result.data.size,
              }
            : { total: 1, page: 0, size: 1 }),
          items: [
            response.data,
            ...(result.type === "success"
              ? result.data.items.slice(0, result.data.size)
              : []),
          ],
        },
        result.type !== "success"
      );
      globalMutate(`${MEME_URL}/${response.data.id}`, response.data, false);
    },
    [api, mutate, result]
  );

  const deleteMeme = async (id: MemeView["id"]) => {
    await api.delete(`${MEME_URL}/${id}`);

    mutate(
      {
        ...(result.type === "success"
          ? result.data
          : { total: 1, page: 0, size: 1 }),
        items:
          result.type === "success"
            ? result.data.items.filter((meme) => meme.id !== id)
            : [],
      },
      result.type !== "success"
    );
  };

  return { result, uploadMeme, deleteMeme };
};
