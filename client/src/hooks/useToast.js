/**
 * useToast Hook
 * 
 * Manages toast notifications
 * Provides success, error, info, warning methods
 */

import { useState, useCallback } from 'react';

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = toastId++;
    const toast = { id, message, type };
    
    setToasts(prev => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const success = useCallback((message, duration) => 
    addToast(message, 'success', duration), [addToast]);
  
  const error = useCallback((message, duration) => 
    addToast(message, 'error', duration), [addToast]);
  
  const info = useCallback((message, duration) => 
    addToast(message, 'info', duration), [addToast]);
  
  const warning = useCallback((message, duration) => 
    addToast(message, 'warning', duration), [addToast]);

  return {
    toasts,
    success,
    error,
    info,
    warning,
    removeToast
  };
}
