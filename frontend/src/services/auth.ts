// import { api } from "../lib/api";

// /**
//  * Send OTP to user's email
//  * @param email - user's email
//  * @param name - user's name
//  */
// export const sendOtp = async (email: string, name: string) => {
//   return api("/auth/otp/send", {
//     method: "POST",
//     json: { email, name },
//   });
// };

// /**
//  * Verify OTP and complete signup
//  * @param email - user's email
//  * @param code - OTP code
//  * @param name - user's name
//  * @param dob - user's date of birth
//  */
// export const verifyOtp = async (
//   email: string,
//   code: string,
//   name: string,
//   dob: string
// ) => {
//   return api("/auth/otp/verify", {
//     method: "POST",
//     json: { email, code, name, dob },
//   });
// };

import { api } from "../lib/api";

type Purpose = "signup" | "signin";

/**
 * Generic OTP send
 */
const sendOtpGeneric = async (
  email: string,
  purpose: Purpose,
  name?: string
) => {
  return api("/auth/otp/send", {
    method: "POST",
    json: { email, name, purpose },
  });
};

/**
 * Signup: send OTP (requires name)
 */
export const sendOtpSignup = async (email: string, name: string) => {
  return sendOtpGeneric(email, "signup", name);
};

/**
 * Signin: send OTP (no name required)
 */
export const sendOtpSignin = async (email: string) => {
  return sendOtpGeneric(email, "signin");
};

/**
 * Verify OTP for signup
 */
export const verifyOtpSignup = async (
  email: string,
  code: string,
  name: string,
  dob: string
) => {
  return api("/auth/otp/verify", {
    method: "POST",
    json: { email, code, name, dob, purpose: "signup" as Purpose },
  });
};

/**
 * Verify OTP for signin
 */
export const verifyOtpSignin = async (email: string, code: string) => {
  return api("/auth/otp/verify", {
    method: "POST",
    json: { email, code, purpose: "signin" as Purpose },
  });
};
