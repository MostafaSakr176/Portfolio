import { useEffect, useState } from "react";

/**
 * True only for devices with a precise, hover-capable pointer (mouse/trackpad).
 * Pointer-driven effects (tilt, magnetic, spotlight) should be skipped otherwise.
 */
export function useFinePointer() {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return fine;
}
