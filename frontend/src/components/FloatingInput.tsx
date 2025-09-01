// import React, { useState } from "react";

// interface FloatingInputProps {
//   label: string;
//   type?: string;
//   id: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   required?: boolean;
//   autoFocus?: boolean;
// }

// const FloatingInput: React.FC<FloatingInputProps> = ({
//   label,
//   type = "text",
//   id,
//   value,
//   onChange,
//   required = false,
//   autoFocus = false,
// }) => {
//   const [isFocused, setIsFocused] = useState(false);
//   const shouldFloat = isFocused || value.length > 0;

//   return (
//     <div className="relative w-full mb-6">
//       <input
//         type={type}
//         id={id}
//         value={value}
//         onChange={onChange}
//         required={required}
//         autoFocus={autoFocus}
//         onFocus={() => setIsFocused(true)}
//         onBlur={() => setIsFocused(false)}
//         placeholder=" "
//         className="w-full border border-gray-300 rounded-md px-3 pt-5 pb-2
//                    outline-none transition-all duration-300 ease-in-out
//                    focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
//       />
//       <label
//         htmlFor={id}
//         className={`absolute left-3 px-1 bg-white text-gray-500 transition-all duration-300 ease-in-out ${
//           shouldFloat
//             ? "top-[-10px] text-sm text-blue-600"
//             : "top-1/2 -translate-y-1/2 text-base"
//         }`}
//       >
//         {label}
//       </label>
//     </div>
//   );
// };

// export default FloatingInput;

import React, { useState } from "react";

interface FloatingInputProps {
  label: string;
  type?: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  autoFocus?: boolean;
}

const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  type = "text",
  id,
  value,
  onChange,
  required = false,
  autoFocus = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const shouldFloat = isFocused || value.length > 0;

  return (
    <div className="relative w-full mb-6">
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        autoFocus={autoFocus}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder=" "
        className="w-full border border-gray-300 rounded-md px-3 pt-5 pb-2
                   outline-none transition-all duration-300 ease-in-out
                   focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
      />
      <label
        htmlFor={id}
        className={`absolute left-3 px-1 bg-white text-gray-500 transition-all duration-300 ease-in-out ${
          shouldFloat
            ? "top-[-10px] text-sm text-blue-600"
            : "top-1/2 -translate-y-1/2 text-base"
        }`}
      >
        {label}
      </label>
    </div>
  );
};

export default FloatingInput;
