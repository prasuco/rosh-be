import * as z from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string().nullish(),
  email: z.string(),
  password: z.string(),
});
