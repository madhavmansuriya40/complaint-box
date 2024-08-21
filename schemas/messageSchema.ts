import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, "The message should be atleast of 10 characters")
    .max(300, "The message should be maximum of 300 characters"),
});
