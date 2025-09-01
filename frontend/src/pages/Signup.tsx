// import React, { useEffect, useState } from "react";
// import signupImage from "../assets/image.png";
// import FloatingInput from "../components/FloatingInput";
// import HDlogo from "../components/HDlogo";

// import { Link, useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { Eye, EyeOff } from "lucide-react";
// import { sendOtpSignup, verifyOtpSignup } from "../services/auth";

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

// const Signup: React.FC = () => {
//   const [name, setName] = useState("");
//   const [dob, setDob] = useState("");
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [showOtp, setShowOtp] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState("");
//   const [cooldown, setCooldown] = useState(0);

//   const navigate = useNavigate();

//   useEffect(() => {
//     if (cooldown <= 0) return;
//     const t = setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
//     return () => clearInterval(t);
//   }, [cooldown]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setStatus("");

//     try {
//       if (!otpSent) {
//         await sendOtpSignup(email, name);
//         setOtpSent(true);
//         setShowOtp(false);
//         setStatus("OTP sent successfully");
//         setCooldown(60);
//       } else {
//         const res: AuthResponse = await verifyOtpSignup(email, otp, name, dob);
//         setStatus("Signed up successfully!");
//         // Store and redirect
//         sessionStorage.setItem("token", res.token);
//         if (res.user) sessionStorage.setItem("user", JSON.stringify(res.user));
//         navigate("/dashboard");
//       }
//     } catch (err) {
//       const msg =
//         err instanceof Error
//           ? err.message
//           : typeof err === "object" && err !== null && "message" in err
//           ? (err as any).message
//           : "Something went wrong";
//       setStatus(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResend = async () => {
//     if (cooldown > 0) return;
//     try {
//       setStatus("");
//       await sendOtpSignup(email, name);
//       setStatus("OTP resent successfully");
//       setCooldown(60);
//     } catch (err) {
//       const msg =
//         err instanceof Error
//           ? err.message
//           : typeof err === "object" && err !== null && "message" in err
//           ? (err as any).message
//           : "Could not resend OTP";
//       setStatus(msg);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, x: -50 }}
//       animate={{ opacity: 1, x: 0 }}
//       exit={{ opacity: 0, x: 50 }}
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
//             <h1 className="text-3xl font-bold mb-2 font-inter">Sign up</h1>
//             <p className="text-gray-500 mb-6">
//               Sign up to enjoy the feature of HD
//             </p>

//             <form className="w-full" onSubmit={handleSubmit}>
//               <AnimatePresence mode="wait">
//                 {!otpSent ? (
//                   <motion.div
//                     key="step1"
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -20 }}
//                     transition={{ duration: 0.3 }}
//                   >
//                     <FloatingInput
//                       id="name"
//                       label="Your Name"
//                       value={name}
//                       onChange={(e) => setName(e.target.value)}
//                       required
//                     />
//                     <FloatingInput
//                       id="dob"
//                       type="date"
//                       label="Date of Birth"
//                       value={dob}
//                       onChange={(e) => setDob(e.target.value)}
//                       required
//                     />
//                     <FloatingInput
//                       id="email"
//                       type="email"
//                       label="Email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       required
//                     />
//                   </motion.div>
//                 ) : (
//                   <motion.div
//                     key="step2"
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -20 }}
//                     transition={{ duration: 0.3 }}
//                   >
//                     <div className="relative mb-2">
//                       <FloatingInput
//                         id="otp"
//                         label="OTP"
//                         type={showOtp ? "text" : "password"}
//                         value={otp}
//                         onChange={(e) => setOtp(e.target.value)}
//                         required
//                         autoFocus
//                       />
//                       <button
//                         type="button"
//                         aria-label={showOtp ? "Hide OTP" : "Show OTP"}
//                         onClick={() => setShowOtp((v) => !v)}
//                         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
//                       >
//                         {showOtp ? <EyeOff size={18} /> : <Eye size={18} />}
//                       </button>
//                     </div>

//                     <p className="text-green-600 text-sm mt-2">
//                       OTP has been sent to your email.
//                     </p>
//                     <p
//                       className={`text-blue-600 text-sm mt-1 cursor-pointer hover:underline ${
//                         cooldown > 0 ? "pointer-events-none opacity-60" : ""
//                       }`}
//                       onClick={handleResend}
//                     >
//                       {cooldown > 0
//                         ? `Resend OTP in ${cooldown}s`
//                         : "Resend OTP"}
//                     </p>
//                   </motion.div>
//                 )}
//               </AnimatePresence>

//               <motion.button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition mt-4"
//                 key={otpSent ? "signup" : "getotp"}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.3 }}
//                 disabled={loading}
//               >
//                 {loading
//                   ? otpSent
//                     ? "Verifying..."
//                     : "Sending OTP..."
//                   : otpSent
//                   ? "Sign Up"
//                   : "Get OTP"}
//               </motion.button>
//             </form>

//             {status && (
//               <p
//                 className={`text-sm text-center mt-4 ${
//                   status.toLowerCase().includes("already exists") ||
//                   status.toLowerCase().includes("error")
//                     ? "text-red-600"
//                     : "text-green-600"
//                 }`}
//               >
//                 {status}
//               </p>
//             )}

//             <p className="text-gray-500 mt-4">
//               Already have an account?{" "}
//               <Link to="/signin" className="text-blue-600 hover:underline">
//                 Sign in
//               </Link>
//             </p>
//           </div>
//         </div>

//         <div className="hidden md:flex flex-1 h-full">
//           <img
//             src={signupImage}
//             alt="Signup"
//             className="object-cover w-full h-full"
//           />
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default Signup;
import React, { useEffect, useState } from "react";
import signupImage from "../assets/image.png";
import FloatingInput from "../components/FloatingInput";
import HDlogo from "../components/HDlogo";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { sendOtpSignup, verifyOtpSignup } from "../services/auth";
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

const Signup: React.FC = () => {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!otpSent) {
        await sendOtpSignup(email, name);
        setOtpSent(true);
        setShowOtp(false);
        toast.success("OTP sent successfully");
        setCooldown(60);
      } else {
        const res: AuthResponse = await verifyOtpSignup(email, otp, name, dob);
        toast.success("Signed up successfully!");
        sessionStorage.setItem("token", res.token);
        if (res.user) sessionStorage.setItem("user", JSON.stringify(res.user));
        navigate("/dashboard");
      }
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null && "message" in err
          ? (err as any).message
          : "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    try {
      await sendOtpSignup(email, name);
      toast.success("OTP resent successfully");
      setCooldown(60);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null && "message" in err
          ? (err as any).message
          : "Could not resend OTP";
      toast.error(msg);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
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
            <h1 className="text-3xl font-bold mb-2 font-inter">Sign up</h1>
            <p className="text-gray-500 mb-6">
              Sign up to enjoy the feature of HD
            </p>

            <form className="w-full" onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {!otpSent ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FloatingInput
                      id="name"
                      label="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <FloatingInput
                      id="dob"
                      type="date"
                      label="Date of Birth"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      required
                    />
                    <FloatingInput
                      id="email"
                      type="email"
                      label="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative mb-2">
                      <FloatingInput
                        id="otp"
                        label="OTP"
                        type={showOtp ? "text" : "password"}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        autoFocus
                      />
                      <button
                        type="button"
                        aria-label={showOtp ? "Hide OTP" : "Show OTP"}
                        onClick={() => setShowOtp((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showOtp ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    <p className="text-green-600 text-sm mt-2">
                      OTP has been sent to your email.
                    </p>
                    <p
                      className={`text-blue-600 text-sm mt-1 cursor-pointer hover:underline ${
                        cooldown > 0 ? "pointer-events-none opacity-60" : ""
                      }`}
                      onClick={handleResend}
                    >
                      {cooldown > 0
                        ? `Resend OTP in ${cooldown}s`
                        : "Resend OTP"}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition mt-4"
                key={otpSent ? "signup" : "getotp"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                disabled={loading}
              >
                {loading
                  ? otpSent
                    ? "Verifying..."
                    : "Sending OTP..."
                  : otpSent
                  ? "Sign Up"
                  : "Get OTP"}
              </motion.button>
            </form>

            <p className="text-gray-500 mt-4">
              Already have an account?{" "}
              <Link to="/signin" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="hidden md:flex flex-1 h-full">
          <img
            src={signupImage}
            alt="Signup"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Signup;
