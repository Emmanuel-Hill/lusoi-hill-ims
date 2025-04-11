import { format } from 'date-fns';

// Helper function to format date
export const formatDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'MMM dd, yyyy');
  } catch (e) {
    return dateString;
  }
};
