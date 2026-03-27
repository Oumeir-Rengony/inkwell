"use client";

import * as React from "react";
import { cn } from "@/lib/utilities";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";

interface AutoSaveTxtAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
   onChange: (value: string) => Promise<void> | void;
   debounceMs?: number;
}

export default function AutoSaveTextarea({
   onChange,
   onBlur,
   debounceMs = 600,
   ...props
}: AutoSaveTxtAreaProps) {


   const debouncedUpdate = useDebouncedCallback(
      (nextValue: string) => {
         onChange(nextValue);
      },
      600,
      [onChange, debounceMs],
      { leading: false, trailing: true }
   );

   function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
      const value = e.target.value;
      debouncedUpdate(value);
   }

   function handleBlur(e: React.FocusEvent<HTMLTextAreaElement>) {
      onBlur?.(e)
      debouncedUpdate.flush();
   }

   return (
      <textarea
         {...props}
         onChange={handleChange}
         onBlur={handleBlur}
      />
   );
}