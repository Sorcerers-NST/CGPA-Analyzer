/**
 * useKeyboardShortcut Hook
 * 
 * Register keyboard shortcuts
 * Supports Cmd/Ctrl modifiers
 */

import { useEffect } from 'react';

export function useKeyboardShortcut(key, callback, modifiers = {}) {
  useEffect(() => {
    const handler = (event) => {
      // Check modifiers
      if (modifiers.ctrl && !event.ctrlKey) return;
      if (modifiers.shift && !event.shiftKey) return;
      if (modifiers.alt && !event.altKey) return;
      if (modifiers.meta && !event.metaKey) return;

      // Check key
      if (event.key.toLowerCase() === key.toLowerCase()) {
        event.preventDefault();
        callback(event);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, callback, modifiers]);
}
