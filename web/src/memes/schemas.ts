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
  overlay_text: nullable(string()),
});

export const MemeListView = array(MemeView);

// eslint-disable-next-line
export type MemeListView = Infer<typeof MemeListView>;
