import { useEffect, useRef } from "react";

interface Thing {
  (): void;
}

export default function useInterval(callback: Thing, delay: number | null) {
  const savedCallback = useRef<Thing>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
