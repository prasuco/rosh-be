import * as z from "zod";
import { CompleteArticle, relatedArticleSchema } from "./index";

export const userSchema = z.object({
  id: z.string(),
  name: z.string().nullish(),
  email: z.string(),
  password: z.string(),
});

export interface CompleteUser extends z.infer<typeof userSchema> {
  articles: CompleteArticle[];
}

/**
 * relatedUserSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedUserSchema: z.ZodSchema<CompleteUser> = z.lazy(() =>
  userSchema.extend({
    articles: relatedArticleSchema.array(),
  }),
);
