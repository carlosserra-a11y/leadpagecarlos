import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** Junta classes do Tailwind sem conflito (o mesmo `cn` que o shadcn usa). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
