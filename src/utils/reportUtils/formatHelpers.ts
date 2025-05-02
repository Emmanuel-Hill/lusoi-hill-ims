
import { format } from 'date-fns';

// Helper function to format date
export const formatDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'MMM dd, yyyy');
  } catch (e) {
    return dateString;
  }
};

// Helper for filename generation with timestamp
export const getFileName = (base: string, extension: string): string => {
  const date = new Date();
  const timestamp = date.toISOString().replace(/[:.]/g, '-').slice(0, 19);
  return `${base}_${timestamp}.${extension}`;
};
