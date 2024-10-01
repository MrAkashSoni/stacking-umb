import { useCallback, useEffect, useRef } from "react";

export const useClickOutsideListenerRef = (onClose) => {
  const ref = useRef(null);

  const clickListener = useCallback(
    (e) => {
      if (!ref.current?.contains(e.target)) {
        onClose();
      }
    },
    [onClose]
  );
  useEffect(() => {
    document.addEventListener("click", clickListener);
    return () => {
      document.removeEventListener("click", clickListener);
    };
  }, [clickListener]);
  return ref;
};
