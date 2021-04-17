import {
  array,
  date,
  Infer,
  object,
  string,
  coerce,
  nullable,
  Struct,
  number,
} from "superstruct";
import { parseISO } from "date-fns";

const Page = <T, S>(itemSchema: Struct<T, S>) =>
  object({
    total: number(),
    items: array(itemSchema),
    page: number(),
    size: number(),
  });

export const MemeView = object({
  id: string(),
  title: string(),
  uploaded_at: coerce(date(), string(), (date) => parseISO(date)),
  filename: string(),
  file_url: string(),
  accessibility_text: nullable(string()),
});

// eslint-disable-next-line
export type MemeView = Infer<typeof MemeView>;

export const MemeCollectionView = Page(MemeView);

// eslint-disable-next-line
export type MemeCollectionView = Infer<typeof MemeCollectionView>;

export type MemeUpdate = Pick<MemeView, "accessibility_text" | "title">;
