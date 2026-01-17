// src/hooks/useToast.js
import toast from 'react-hot-toast';

export function useToast() {
  return {
    toast,
    success: (msg) => toast.success(msg),
    error: (msg) => toast.error(msg)
  };
}