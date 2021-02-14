import { array, object, string } from "superstruct";

export const MemeView = object({
  id: string(),
  title: string(),
  filename: string(),
});

export const MemeListView = array(MemeView);
