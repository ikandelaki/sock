import * as z from "zod";

export const User = z.object({
  id: z.number().optional(),
  email: z.string(),
  name: z.string(),
  password: z.string(),
});

export type UserType = z.infer<typeof User>;

export default User;
