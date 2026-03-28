import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines clsx and tailwind-merge for optimal class merging.
 * @param inputs - Class names or conditional class values.
 * @returns A single string with merged class names.
 */
export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

export function parseCommaList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}


export function calculateReadingTime(text: string, wordsPerMinute = 190) {
  const wordCount = text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const minutes = Math.ceil(wordCount / wordsPerMinute);

  return {
    wordCount,
    minutes,
    label: `${minutes} min read`,
  };
}

export const wait = (ms: number = 2000) => new Promise((resolve) => setTimeout(resolve, ms));