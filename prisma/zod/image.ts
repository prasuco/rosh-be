import * as z from "zod";
import { CompleteArticle, relatedArticleSchema } from "./index";

export const imageSchema = z.object({
  id: z.string(),
  name: z.string(),
  filePath: z.string(),
  url: z.string(),
});

export interface CompleteImage extends z.infer<typeof imageSchema> {
  Article: CompleteArticle[];
}

/**
 * relatedImageSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedImageSchema: z.ZodSchema<CompleteImage> = z.lazy(() =>
  imageSchema.extend({
    Article: relatedArticleSchema.array(),
  }),
);
