// import React, { useEffect, useState } from "react";
// import signupImage from "../assets/image.png";
// import FloatingInput from "../components/FloatingInput";
// import HDlogo from "../components/HDlogo";
// import { useNavigate, Link } from "react-router-dom";
// import { Eye, EyeOff } from "lucide-react";
// import { motion } from "framer-motion";
// import { sendOtpSignin, verifyOtpSignin } from "../services/auth";

// interface AuthResponse {
//   token: string;
//   user?: {
//     id: string;
//     email: string;
//     name: string;
//     dob?: string;
//     provider: string;
//   };
// }

// const Signin: React.FC = () => {
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [showOtp, setShowOtp] = useState(false);
//   const [keepLoggedIn, setKeepLoggedIn] = useState(false);

//   const [otpSent, setOtpSent] = useState(false);
//   const [cooldown, setCooldown] = useState(0);
//   const [sending, setSending] = useState(false);
//   const [verifying, setVerifying] = useState(false);

//   const navigate = useNavigate(); // ✅ hook for navigation

//   useEffect(() => {
//     if (cooldown <= 0) return;
//     const t = setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
//     return () => clearInterval(t);
//   }, [cooldown]);

//   const requestOtp = async () => {
//     if (!email.trim()) {
//       alert("Enter your email to receive an OTP.");
//       return;
//     }
//     if (cooldown > 0 || sending) return;

//     try {
//       setSending(true);
//       await sendOtpSignin(email);
//       setOtpSent(true);
//       setCooldown(60);
//       alert("OTP sent to your email.");
//     } catch (err) {
//       const msg =
//         err instanceof Error
//           ? err.message
//           : typeof err === "object" && err !== null && "message" in err
//           ? (err as any).message
//           : "Could not send OTP. Please try again.";
//       alert(msg);
//     } finally {
//       setSending(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!email || !otp) {
//       alert("Please enter valid credentials!");
//       return;
//     }

//     try {
//       setVerifying(true);
//       const res: AuthResponse = await verifyOtpSignin(email, otp);
//       const { token, user } = res;

//       const storage = keepLoggedIn ? localStorage : sessionStorage;
//       storage.setItem("token", token);
//       if (user) storage.setItem("user", JSON.stringify(user));

//       navigate("/dashboard"); // ✅ redirect to dashboard
//     } catch (err) {
//       const msg =
//         err instanceof Error
//           ? err.message
//           : typeof err === "object" && err !== null && "message" in err
//           ? (err as any).message
//           : "Incorrect OTP or verification failed.";
//       alert(msg);
//     } finally {
//       setVerifying(false);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, x: 50 }}
//       animate={{ opacity: 1, x: 0 }}
//       exit={{ opacity: 0, x: -50 }}
//       transition={{ duration: 0.4 }}
//       className="min-h-screen bg-gray-50 flex items-center justify-center px-4"
//     >
//       <div className="flex w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden h-[90vh]">
//         <div className="flex flex-col w-full max-w-md h-full">
//           <div className="p-6">
//             <div className="flex items-center space-x-2">
//               <div className="w-8 h-8">
//                 <HDlogo />
//               </div>
//               <div className="w-10 h-10 flex justify-center items-center rounded-full font-bold text-2xl">
//                 HD
//               </div>
//             </div>
//           </div>

//           <div className="flex-1 flex flex-col justify-center px-8 py-6">
//             <h1 className="text-3xl font-bold mb-2 font-inter">Sign in</h1>
//             <p className="text-gray-500 mb-6">
//               Please login to continue to your account.
//             </p>

//             <form className="w-full" onSubmit={handleSubmit}>
//               <FloatingInput
//                 id="email"
//                 type="email"
//                 label="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />

//               <div className="relative mb-4">
//                 <FloatingInput
//                   id="otp"
//                   type={showOtp ? "text" : "password"}
//                   label="OTP"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowOtp(!showOtp)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
//                 >
//                   {showOtp ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>

//               <p
//                 className={`text-blue-600 text-sm mb-4 cursor-pointer hover:underline ${
//                   cooldown > 0 || sending
//                     ? "pointer-events-none opacity-60"
//                     : ""
//                 }`}
//                 onClick={requestOtp}
//               >
//                 {otpSent
//                   ? cooldown > 0
//                     ? `Resend OTP in ${cooldown}s`
//                     : "Resend OTP"
//                   : cooldown > 0
//                   ? `Send OTP in ${cooldown}s`
//                   : "Send OTP"}
//               </p>

//               <div className="flex items-center mb-6">
//                 <input
//                   id="keepLoggedIn"
//                   type="checkbox"
//                   checked={keepLoggedIn}
//                   onChange={(e) => setKeepLoggedIn(e.target.checked)}
//                   className="mr-2"
//                 />
//                 <label htmlFor="keepLoggedIn" className="text-gray-600 text-sm">
//                   Keep me logged in
//                 </label>
//               </div>

//               <motion.button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.3 }}
//                 disabled={verifying}
//               >
//                 {verifying ? "Verifying..." : "Sign in"}
//               </motion.button>
//             </form>

//             <p className="text-gray-500 mt-4">
//               Need an account?{" "}
//               <Link to="/signup" className="text-blue-600 hover:underline">
//                 Create one
//               </Link>
//             </p>
//           </div>
//         </div>

//         <div className="hidden md:flex flex-1 h-full">
//           <img
//             src={signupImage}
//             alt="Signin"
//             className="object-cover w-full h-full"
//           />
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default Signin;

import React, { useEffect, useState } from "react";
import signupImage from "../assets/image.png";
import FloatingInput from "../components/FloatingInput";
import HDlogo from "../components/HDlogo";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { sendOtpSignin, verifyOtpSignin } from "../services/auth";
import { toast } from "react-hot-toast";

interface AuthResponse {
  token: string;
  user?: {
    id: string;
    email: string;
    name: string;
    dob?: string;
    provider: string;
  };
}

const Signin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const requestOtp = async () => {
    if (!email.trim()) {
      toast.error("Enter your email to receive an OTP.");
      return;
    }
    if (cooldown > 0 || sending) return;

    try {
      setSending(true);
      await sendOtpSignin(email);
      setOtpSent(true);
      setCooldown(60);
      toast.success("OTP sent to your email.");
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null && "message" in err
          ? (err as any).message
          : "Could not send OTP. Please try again.";
      toast.error(msg);
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !otp) {
      toast.error("Please enter valid credentials!");
      return;
    }

    try {
      setVerifying(true);
      const res: AuthResponse = await verifyOtpSignin(email, otp);
      const { token, user } = res;

      const storage = keepLoggedIn ? localStorage : sessionStorage;
      storage.setItem("token", token);
      if (user) storage.setItem("user", JSON.stringify(user));

      toast.success("Signed in successfully!");
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null && "message" in err
          ? (err as any).message
          : "Incorrect OTP or verification failed.";
      toast.error(msg);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-50 flex items-center justify-center px-4"
    >
      <div className="flex w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden h-[90vh]">
        <div className="flex flex-col w-full max-w-md h-full">
          <div className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8">
                <HDlogo />
              </div>
              <div className="w-10 h-10 flex justify-center items-center rounded-full font-bold text-2xl">
                HD
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center px-8 py-6">
            <h1 className="text-3xl font-bold mb-2 font-inter">Sign in</h1>
            <p className="text-gray-500 mb-6">
              Please login to continue to your account.
            </p>

            <form className="w-full" onSubmit={handleSubmit}>
              <FloatingInput
                id="email"
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="relative mb-4">
                <FloatingInput
                  id="otp"
                  type={showOtp ? "text" : "password"}
                  label="OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowOtp(!showOtp)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showOtp ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <p
                className={`text-blue-600 text-sm mb-4 cursor-pointer hover:underline ${
                  cooldown > 0 || sending
                    ? "pointer-events-none opacity-60"
                    : ""
                }`}
                onClick={requestOtp}
              >
                {otpSent
                  ? cooldown > 0
                    ? `Resend OTP in ${cooldown}s`
                    : "Resend OTP"
                  : cooldown > 0
                  ? `Send OTP in ${cooldown}s`
                  : "Send OTP"}
              </p>

              <div className="flex items-center mb-6">
                <input
                  id="keepLoggedIn"
                  type="checkbox"
                  checked={keepLoggedIn}
                  onChange={(e) => setKeepLoggedIn(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="keepLoggedIn" className="text-gray-600 text-sm">
                  Keep me logged in
                </label>
              </div>

              <motion.button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                disabled={verifying}
              >
                {verifying ? "Verifying..." : "Sign in"}
              </motion.button>
            </form>

            <p className="text-gray-500 mt-4">
              Need an account?{" "}
              <Link to="/signup" className="text-blue-600 hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>

        <div className="hidden md:flex flex-1 h-full">
          <img
            src={signupImage}
            alt="Signin"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Signin;
