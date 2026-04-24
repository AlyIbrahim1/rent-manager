import { useEffect, useState } from "react";

export type AnimatedPresenceState = "open" | "closed";

export function useAnimatedPresence(isOpen: boolean, exitDuration = 220) {
  const [isMounted, setIsMounted] = useState(isOpen);
  const [state, setState] = useState<AnimatedPresenceState>(isOpen ? "open" : "closed");

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      const frame = window.requestAnimationFrame(() => {
        setState("open");
      });

      return () => {
        window.cancelAnimationFrame(frame);
      };
    }

    setState("closed");

    if (!isMounted) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setIsMounted(false);
    }, exitDuration);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [exitDuration, isMounted, isOpen]);

  return { isMounted, state };
}
