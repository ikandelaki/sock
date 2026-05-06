import * as z from "zod";

export const UserRegister = z.object({
  id: z.number().optional(),
  email: z.string(),
  name: z.string(),
  password: z.string(),
});

export const UserLogin = z.object({
  email: z.string(),
  password: z.string(),
});

export type UserRegisterType = z.infer<typeof UserRegister>;
export type UserLoginType = z.infer<typeof UserLogin>;
