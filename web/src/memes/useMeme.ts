import { is } from "superstruct";
import { match } from "variant";
import { useApiResult, useClient, AsyncResult } from "../api";
import { MemeView, MemeUpdate } from "./schemas";
import { MEME_URL } from "./constants";
import { AxiosError } from "axios";

export const useMeme = (memeId: string) => {
  const client = useClient();
  const { result, mutate } = useApiResult(`${MEME_URL}/${memeId}`, MemeView);

  const updateMeme = async (
    update: MemeUpdate
  ): Promise<AsyncResult<MemeView, AxiosError | Error>> => {
    const ret = await match(result, {
      async success({ data }) {
        try {
          const resp = await client.api.put<unknown>(
            `${MEME_URL}/${memeId}`,
            update
          );

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

  return { meme: result, updateMeme };
};
