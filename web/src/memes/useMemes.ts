import { shared } from "../config";
import { useApiResult } from "../api";
import { MemeListView } from "./schemas";

export const useMemes = () => {
  const result = useApiResult(`${shared.API_BASE}/memes`, MemeListView);

  return { result };
};
