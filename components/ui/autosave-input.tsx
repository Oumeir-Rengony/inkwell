"use client";

import * as React from "react";
import { cn } from "@/lib/utilities";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";

interface AutoSaveInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
   onChange: (value: string) => Promise<void> | void;
   debounceMs?: number;
}

export function AutoSaveInput({
   onChange,
   onBlur,
   debounceMs = 600,
   ...props
}: AutoSaveInputProps) {


   const debouncedUpdate = useDebouncedCallback(
      (nextValue: string) => {
         onChange(nextValue);
      },
      600,
      [onChange, debounceMs],
      { leading: false, trailing: true }
   );

   function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const value = e.target.value;
      debouncedUpdate(value);
   }

   function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
      onBlur?.(e)
      debouncedUpdate.flush();
   }

   return (
      <input
         {...props}
         onChange={handleChange}
         onBlur={handleBlur}
      />
   );
}

export default AutoSaveInput;