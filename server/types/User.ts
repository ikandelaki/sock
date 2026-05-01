import * as z from "zod";

export const User = z.object({
  email: z.string(),
  name: z.string(),
  password: z.string(),
});

export default User;
