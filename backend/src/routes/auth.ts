// import express from "express";
// import jwt from "jsonwebtoken";
// import rateLimit from "express-rate-limit";

// import Otp from "../models/Otp";
// import User from "../models/User";
// import {
//   generateOtp,
//   hashOtp,
//   expiryDate,
//   notExpired,
//   canResend,
// } from "../utils/otp";
// import { sendEmail } from "../utils/sendEmail";
// import { config } from "../config/env";
// import { verifyGoogleToken } from "../utils/verifyGoogleToken";

// const router = express.Router();

// // Rate limiter for OTP requests
// const otpLimiter = rateLimit({
//   windowMs: 60 * 1000, // 1 minute
//   max: 3,
//   message: { error: { message: "Too many OTP requests. Please wait." } },
// });

// /**
//  * POST /auth/otp/send
//  * body: { email, name?, purpose: "signup" | "signin" }
//  */
// router.post("/otp/send", otpLimiter, async (req, res, next) => {
//   try {
//     const { email, name, purpose } = req.body as {
//       email?: string;
//       name?: string;
//       purpose?: "signup" | "signin";
//     };

//     if (!email || !purpose) {
//       return res
//         .status(400)
//         .json({ error: { message: "Email and purpose are required." } });
//     }

//     // Purpose-specific checks
//     if (purpose === "signin") {
//       const user = await User.findOne({ email });
//       if (!user) {
//         return res.status(404).json({
//           error: { message: "Account does not exist. Please sign up." },
//         });
//       }
//     } else if (purpose === "signup") {
//       if (!name) {
//         return res
//           .status(400)
//           .json({ error: { message: "Name is required for signup." } });
//       }
//       const existing = await User.findOne({ email });
//       if (existing) {
//         return res.status(409).json({
//           error: { message: "Account already exists. Please sign in." },
//         });
//       }
//     }

//     if (!(await canResend(email))) {
//       return res.status(429).json({
//         error: { message: "Please wait before requesting another OTP." },
//       });
//     }

//     const code = generateOtp();
//     const codeHash = hashOtp(code);
//     const expiresAt = expiryDate();
//     const now = new Date();

//     await Otp.findOneAndUpdate(
//       { email },
//       { email, codeHash, expiresAt, lastSentAt: now, attempts: 0 },
//       { upsert: true, new: true }
//     );

//     // await sendEmail(
//     //   email,
//     //   "Your OTP Code",
//     //   `<p>Your OTP is <strong>${code}</strong></p>`
//     // );
//     await sendEmail(
//       "yourboss@gmail.com",
//       "Your OTP",
//       "<p>Your OTP is <strong>123456</strong></p>"
//     );

//     return res.json({ success: true, message: "OTP sent successfully" });
//   } catch (err) {
//     next(err);
//   }
// });

// /**
//  * POST /auth/otp/verify
//  * body (signin): { email, code, purpose: "signin" }
//  * body (signup): { email, code, name, dob, purpose: "signup" }
//  */
// router.post("/otp/verify", async (req, res, next) => {
//   try {
//     const { email, code, purpose, name, dob } = req.body as {
//       email?: string;
//       code?: string;
//       purpose?: "signup" | "signin";
//       name?: string;
//       dob?: string;
//     };

//     if (!email || !code || !purpose) {
//       return res.status(400).json({
//         error: { message: "Email, OTP code, and purpose are required." },
//       });
//     }

//     const entry = await Otp.findOne({ email });
//     if (!entry) {
//       return res.status(400).json({
//         error: { message: "OTP not requested for this email." },
//       });
//     }

//     entry.attempts += 1;
//     await entry.save();

//     if (!notExpired(entry.expiresAt)) {
//       return res.status(400).json({ error: { message: "OTP expired." } });
//     }

//     const match = hashOtp(code) === entry.codeHash;
//     if (!match) {
//       return res.status(400).json({ error: { message: "Incorrect OTP." } });
//     }

//     let user = await User.findOne({ email });

//     if (purpose === "signup") {
//       if (user) {
//         return res.status(409).json({
//           error: { message: "Account already exists. Please sign in." },
//         });
//       }

//       user = await User.create({
//         email,
//         name: name || "User",
//         dob,
//         provider: "email",
//       });
//     }

//     if (purpose === "signin") {
//       if (!user) {
//         return res.status(404).json({
//           error: { message: "Account does not exist. Please sign up." },
//         });
//       }
//     }

//     await Otp.deleteOne({ email });

//     const payload = { id: user.id, email: user.email };
//     const token = jwt.sign(payload, config.JWT_SECRET, {
//       expiresIn: config.JWT_EXPIRES_IN,
//     });

//     return res.json({
//       success: true,
//       token,
//       user: {
//         id: user.id,
//         email: user.email,
//         name: user.name,
//         dob: user.dob,
//         provider: user.provider,
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// });

// /**
//  * POST /auth/google
//  * body: { idToken }
//  */
// router.post("/google", async (req, res, next) => {
//   try {
//     const { idToken } = req.body;
//     if (!idToken) {
//       return res
//         .status(400)
//         .json({ error: { message: "Missing Google token" } });
//     }

//     const { email, name, googleId } = await verifyGoogleToken(idToken);

//     let user = await User.findOne({ email });
//     if (!user) {
//       user = await User.create({
//         email,
//         name,
//         provider: "google",
//         googleId,
//       });
//     } else if (!user.googleId) {
//       user.googleId = googleId;
//       user.provider = "google";
//       await user.save();
//     }

//     const token = jwt.sign(
//       { id: user.id, email: user.email },
//       config.JWT_SECRET,
//       { expiresIn: config.JWT_EXPIRES_IN }
//     );

//     res.json({
//       token,
//       user: {
//         id: user.id,
//         email: user.email,
//         name: user.name,
//         dob: user.dob,
//         provider: user.provider,
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// });

// export default router;
import express from "express";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";

import Otp from "../models/Otp";
import User from "../models/User";
import {
  generateOtp,
  hashOtp,
  expiryDate,
  notExpired,
  canResend,
} from "../utils/otp";
import { sendEmail } from "../utils/sendEmail";
import { config } from "../config/env";
import { verifyGoogleToken } from "../utils/verifyGoogleToken";

const router = express.Router();

// Rate limiter for OTP requests
const otpLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3,
  message: { error: { message: "Too many OTP requests. Please wait." } },
});

/**
 * POST /auth/otp/send
 * body: { email, name?, purpose: "signup" | "signin" }
 */
router.post("/otp/send", otpLimiter, async (req, res, next) => {
  try {
    const { email, name, purpose } = req.body as {
      email?: string;
      name?: string;
      purpose?: "signup" | "signin";
    };

    if (!email || !purpose) {
      return res
        .status(400)
        .json({ error: { message: "Email and purpose are required." } });
    }

    if (purpose === "signin") {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          error: { message: "Account does not exist. Please sign up." },
        });
      }
    } else if (purpose === "signup") {
      if (!name) {
        return res
          .status(400)
          .json({ error: { message: "Name is required for signup." } });
      }
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(409).json({
          error: { message: "Account already exists. Please sign in." },
        });
      }
    }

    if (!(await canResend(email))) {
      return res.status(429).json({
        error: { message: "Please wait before requesting another OTP." },
      });
    }

    const code = generateOtp();
    const codeHash = hashOtp(code);
    const expiresAt = expiryDate();
    const now = new Date();

    await Otp.findOneAndUpdate(
      { email },
      { email, codeHash, expiresAt, lastSentAt: now, attempts: 0 },
      { upsert: true, new: true }
    );

    await sendEmail(
      email,
      "Your OTP Code",
      `<p>Your OTP is <strong>${code}</strong></p>`
    );

    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /auth/otp/verify
 * body (signin): { email, code, purpose: "signin" }
 * body (signup): { email, code, name, dob, purpose: "signup" }
 */
router.post("/otp/verify", async (req, res, next) => {
  try {
    const { email, code, purpose, name, dob } = req.body as {
      email?: string;
      code?: string;
      purpose?: "signup" | "signin";
      name?: string;
      dob?: string;
    };

    if (!email || !code || !purpose) {
      return res.status(400).json({
        error: { message: "Email, OTP code, and purpose are required." },
      });
    }

    const entry = await Otp.findOne({ email });
    if (!entry) {
      return res.status(400).json({
        error: { message: "OTP not requested for this email." },
      });
    }

    entry.attempts += 1;
    await entry.save();

    if (!notExpired(entry.expiresAt)) {
      return res.status(400).json({ error: { message: "OTP expired." } });
    }

    const match = hashOtp(code) === entry.codeHash;
    if (!match) {
      return res.status(400).json({ error: { message: "Incorrect OTP." } });
    }

    let user = await User.findOne({ email });

    if (purpose === "signup") {
      if (user) {
        return res.status(409).json({
          error: { message: "Account already exists. Please sign in." },
        });
      }

      user = await User.create({
        email,
        name: name || "User",
        dob,
        provider: "email",
      });
    }

    if (purpose === "signin" && !user) {
      return res.status(404).json({
        error: { message: "Account does not exist. Please sign up." },
      });
    }

    await Otp.deleteOne({ email });

    // TypeScript-safe: user is guaranteed to exist here
    const payload = { id: user!.id, email: user!.email };
    const token = jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN,
    });

    return res.json({
      success: true,
      token,
      user: {
        id: user!.id,
        email: user!.email,
        name: user!.name,
        dob: user!.dob,
        provider: user!.provider,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /auth/google
 * body: { idToken }
 */
router.post("/google", async (req, res, next) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res
        .status(400)
        .json({ error: { message: "Missing Google token" } });
    }

    const { email, name, googleId } = await verifyGoogleToken(idToken);

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        name,
        provider: "google",
        googleId,
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      user.provider = "google";
      await user.save();
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        dob: user.dob,
        provider: user.provider,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
