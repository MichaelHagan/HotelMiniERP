import { format, formatDistance, formatRelative } from 'date-fns';

export const formatDate = (date: string | Date, formatString: string = 'MMM dd, yyyy'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatString);
};

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'MMM dd, yyyy HH:mm');
};

export const formatTimeAgo = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistance(dateObj, new Date(), { addSuffix: true });
};

export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatRelative(dateObj, new Date());
};

export const isDatePast = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj < new Date();
};

export const isDateWithinDays = (date: string | Date, days: number): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  return dateObj <= futureDate;
};