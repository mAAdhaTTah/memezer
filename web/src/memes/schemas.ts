import { array, Infer, object, string } from "superstruct";

export const MemeView = object({
  id: string(),
  title: string(),
  filename: string(),
});

export const MemeListView = array(MemeView);

// eslint-disable-next-line
export type MemeListView = Infer<typeof MemeListView>;
