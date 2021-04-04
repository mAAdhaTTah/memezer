import {
  array,
  date,
  Infer,
  object,
  string,
  coerce,
  nullable,
} from "superstruct";
import { parseISO } from "date-fns";

export const MemeView = object({
  id: string(),
  title: string(),
  uploaded_at: coerce(date(), string(), (date) => parseISO(date)),
  filename: string(),
  file_url: string(),
  accessibility_text: nullable(string()),
});

export type MemeView = Infer<typeof MemeView>;

export const MemeListView = array(MemeView);

// eslint-disable-next-line
export type MemeListView = Infer<typeof MemeListView>;

export type MemeUpdate = Pick<MemeView, "accessibility_text" | "title">;
