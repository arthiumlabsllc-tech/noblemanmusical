"use client";

import { useEffect, useRef, useCallback } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Traps focus within a container element when `active` is true.
 * Returns a ref to attach to the container, and a way to set the trigger element
 * so focus returns to it on close.
 */
export function useFocusTrap(active: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Capture the element that had focus before the trap activated
  useEffect(() => {
    if (active) {
      triggerRef.current = document.activeElement as HTMLElement;
    }
  }, [active]);

  // Focus first focusable element when trap activates
  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const focusable = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);

    if (focusable.length > 0) {
      // Small delay to let animations start
      setTimeout(() => focusable[0].focus(), 50);
    }
  }, [active]);

  // Return focus to trigger when trap deactivates
  useEffect(() => {
    if (!active && triggerRef.current) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, [active]);

  // Handle Tab / Shift+Tab cycling
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !containerRef.current) return;

      const container = containerRef.current;
      const focusable = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        // Shift+Tab: if focus is on first element, wrap to last
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab: if focus is on last element, wrap to first
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    []
  );

  useEffect(() => {
    if (!active) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [active, handleKeyDown]);

  return containerRef;
}
