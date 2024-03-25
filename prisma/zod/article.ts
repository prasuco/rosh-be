import * as z from "zod";
import { CONTENT_TYPE } from "@prisma/client";
import { CompleteImage, relatedImageSchema } from "./index";

export const articleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  content: z.string(),
  type: z.nativeEnum(CONTENT_TYPE),
  imageId: z.string().nullish(),
});

export interface CompleteArticle extends z.infer<typeof articleSchema> {
  image?: CompleteImage | null;
}

/**
 * relatedArticleSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedArticleSchema: z.ZodSchema<CompleteArticle> = z.lazy(() =>
  articleSchema.extend({
    image: relatedImageSchema.nullish(),
  }),
);
