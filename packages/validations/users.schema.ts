import * as z from "zod";
import { object, number, string, TypeOf } from "zod";
import path from "path";


const registerPayload = {
  body: z.object({
    name: z.string().min(1).max(255),
    loginId : z.string(),
    phoneNumber : z.string().min(1).max(11, 'Phone Number should be of 10 digits')
  }),
};

const loginPayload = {
  body: z.object({
    loginId: z.string(),
    password: z.string()
  }),
}

const otpVerificationPayload = {
  body: z.object({
      otp : z.string().min(1).max(7),
      phoneNumber : z.string().min(1).max(11, 'Phone Number should be of 10 digits'),
      fullHash : z.string(),
      loginId : z.string()
  }),
}

const params = {
  params: z.object({
    salesInfoId: string({
      required_error: "salesInfoId is required",
    }),
  }),
};

  export const registerUserSchema = z.object({
      ...registerPayload,
  });
  export const loginUserSchema = z.object({
    ...loginPayload,
});
export const otpVerificationSchema = z.object({
  ...otpVerificationPayload,
});
  


export type RegisterUserSchema = z.infer<typeof registerUserSchema>;
export type LoginUserSchema = z.infer<typeof loginUserSchema>;
export type OtpVerificationSchema = z.infer<typeof otpVerificationSchema>;



