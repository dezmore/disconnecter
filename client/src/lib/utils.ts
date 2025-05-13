import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format time in 12-hour format with AM/PM
export function formatTime(date: Date): string {
  let hours = date.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${hours}:${minutes}:${seconds} ${ampm}`;
}

// Format date in DD/MM/YYYY format
export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
}

// Format date and time for logs: HH:MM AM/PM - DD/MM/YYYY
export function formatDateTimeForLogs(date: Date): string {
  const timeStr = formatTime(date);
  const dateStr = formatDate(date);
  
  return `${timeStr.split(' ')[0]} ${timeStr.split(' ')[1]} - ${dateStr}`;
}
