// src/utils/helpers.js
import { format } from 'date-fns';

export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return format(new Date(dateString), 'MMM dd, yyyy');
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return dateString; // Return original if invalid
  }
};