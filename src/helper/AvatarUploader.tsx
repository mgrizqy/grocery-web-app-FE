// "use client";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Input } from "@/components/ui/input";
// import { useEffect, useRef, useState } from "react";
// import { UseFormRegisterReturn } from "react-hook-form";

// interface IAvatarUploaderProps {
//   defaultImage?: string;
//   register: UseFormRegisterReturn;
//   disabled?: boolean;
//   className?: string;
// }

// export default function AvatarUploader({
//   defaultImage,
//   register,
//   disabled = false,
//   className,
// }: IAvatarUploaderProps) {
//   const inputRef = useRef<HTMLInputElement>(null);
//   const [preview, setPreview] = useState<string | null>(defaultImage || null);

//   useEffect(() => {
//     setPreview(defaultImage || null);
//   }, [defaultImage]);

//   const handleAvatarClick = () => {
//     if (!disabled) {
//       inputRef.current?.click();
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const url = URL.createObjectURL(file);
//       setPreview(url);
//     }
//   };
//   return (
//     <div className="flex flex-col items-center gap-2">
//       <div onClick={handleAvatarClick} className="cursor-pointer">
//         <Avatar className={`${className}  size-20 md:size-28`}>
//           <AvatarImage src={preview || ""} />
//           <AvatarFallback>IMG</AvatarFallback>
//         </Avatar>
//       </div>

//       <Input
//         type="file"
//         accept="image/png, image/jpeg, image/jpg, image/gif"
//         {...register}
//         ref={(e) => {
//           register.ref(e);
//           inputRef.current = e;
//         }}
//         className="hidden"
//         onChange={(e) => {
//           register.onChange(e);
//           handleFileChange(e);
//         }}
//         disabled={disabled}
//       />
//     </div>
//   );
// }
