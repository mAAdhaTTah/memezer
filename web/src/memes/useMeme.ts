import { mutate as globalMutate } from "swr";
import { is } from "superstruct";
import { match } from "variant";
import { AxiosError } from "axios";
import { useApiResult, useClient, AsyncResult } from "../api";
import { MemeView, MemeUpdate } from "./schemas";
import { MEME_URL } from "./constants";

export const useMeme = (memeId: string) => {
  const { api } = useClient();
  const { result, mutate } = useApiResult(`${MEME_URL}/${memeId}`, MemeView);

  const updateMeme = async (
    update: MemeUpdate
  ): Promise<AsyncResult<MemeView, AxiosError | Error>> => {
    const ret = await match(result, {
      async success({ data }) {
        try {
          const resp = await api.put<unknown>(`${MEME_URL}/${memeId}`, update);

          if (is(resp.data, MemeView)) {
            data = resp.data;
          } else {
            data = { ...data, ...update };
          }

          mutate(data);

          return AsyncResult.success({ data });
        } catch (error) {
          return AsyncResult.error({ error });
        }
      },
      async loading() {
        return AsyncResult.error({ error: new Error("Loading") });
      },
      async error({ error }) {
        return AsyncResult.error({ error });
      },
    });

    return ret;
  };

  const deleteMeme = async () => {
    await api.delete(`${MEME_URL}/${memeId}`);
    mutate(null, false);
    globalMutate(MEME_URL);
  };

  return { meme: result, updateMeme, deleteMeme };
};
