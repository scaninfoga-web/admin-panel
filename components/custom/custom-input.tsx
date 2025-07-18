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
//   label: string;
//   placeholder?: string;
//   type?: string;
//   className?: string;
// }

// export function CustomInput({
//   name,
//   label,
//   placeholder,
//   type = 'text',
//   className,
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

interface FormInputProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  className?: string;
  disabled?: boolean; // ✅ Add disabled prop here
}

export function CustomInput({
  name,
  label,
  placeholder,
  type = 'text',
  className,
  disabled, // ✅ Destructure disabled
}: FormInputProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              type={type}
              disabled={disabled} // ✅ Pass to Input component
              className={cn(
                'rounded-xl border-emerald-500 bg-[#0A0D14] py-6 text-white placeholder-gray-400',
                className,
              )}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

