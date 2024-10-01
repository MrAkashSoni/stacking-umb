import { useEffect, useRef, useState } from "react";

export const useScrollOnLoad = () => {
  const ref = useRef();
  const current = ref.current;

  const [hasScrolledIntoView, setHasScrolledIntoView] = useState(false);

  useEffect(() => {
    if (ref.current && ref.current.scrollIntoView && !hasScrolledIntoView) {
      ref.current.scrollIntoView();
      setHasScrolledIntoView(true);
    }
  }, [ref, current, hasScrolledIntoView]);

  return ref;
};
