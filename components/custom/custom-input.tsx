// 'use client';

// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { cn } from '@/lib/utils';
// import { useFormContext } from 'react-hook-form';

// interface FormInputProps {
//   name: string;
//   label?: string;
//   placeholder?: string;
//   type?: string;
//   className?: string;
//   disabled?: boolean; // ✅ Add disabled prop here
// }

// export function CustomInput({
//   name,
//   label,
//   placeholder,
//   type = 'text',
//   className,
//   disabled, // ✅ Destructure disabled
// }: FormInputProps) {
//   const { control } = useFormContext();

//   return (
//     <FormField
//       control={control}
//       name={name}
//       render={({ field }) => (
//         <FormItem>
//           <FormLabel>{label}</FormLabel>
//           <FormControl>
//             <Input
//               placeholder={placeholder}
//               type={type}
//               disabled={disabled} // ✅ Pass to Input component
//               className={cn(
//                 'rounded-xl border-emerald-500 bg-[#0A0D14] py-6 text-white placeholder-gray-400',
//                 className,
//               )}
//               {...field}
//             />
//           </FormControl>
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   );
// }




'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';
import React, { useEffect, useRef } from 'react';

interface FormInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: string; // 'text' | 'number' | 'textarea' | etc.
  className?: string;
  disabled?: boolean;
}

export function CustomInput({
  name,
  label,
  placeholder,
  type = 'text',
  className,
  disabled,
}: FormInputProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // 🌿 Auto-expanding textarea logic
        const textareaRef = useRef<HTMLTextAreaElement | null>(null);

        useEffect(() => {
          const textarea = textareaRef.current;
          if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
          }
        }, [field.value]);

        const sharedStyles = cn(
          'rounded-xl border-emerald-500 bg-[#0A0D14] py-4 text-white placeholder-gray-400',
          className,
        );

        return (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              {type === 'textarea' ? (
                <textarea
                  {...field}
                  ref={(ref) => {
                    field.ref(ref);
                    textareaRef.current = ref;
                  }}
                  placeholder={placeholder}
                  disabled={disabled}
                  rows={3}
                  className={cn(sharedStyles, 'resize-none w-full p-2')}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = target.scrollHeight + 'px';
                    field.onChange(target.value); // Connect to react-hook-form
                  }}
                />
              ) : (
                <Input
                  {...field}
                  type={type}
                  placeholder={placeholder}
                  disabled={disabled}
                  className={sharedStyles}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
