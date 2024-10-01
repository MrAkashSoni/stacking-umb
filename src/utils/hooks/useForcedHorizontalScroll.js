import { useEffect, useRef } from "react";

const percentageToScroll = 0.25;
const percetageRenderedByViewPort = 0.75;

export function useForcedHorizontalScroll() {
  const ref = useRef();

  useEffect(() => {
    const element = ref.current;

    if (element) {
      const onMouseWheel = (event) => {
        const elementPositions = element.getBoundingClientRect();
        const distanceFromBottom = elementPositions.bottom;
        const isInsideViewPort =
          distanceFromBottom * percetageRenderedByViewPort <=
          window.innerHeight;

        if (isInsideViewPort) {
          const directionMultiplier = event.deltaY / Math.abs(event.deltaY);

          const spaceOnLeft = element.scrollLeft;

          const hasScrolledLeft = event.deltaY < 0;
          const hasScrolledRight = event.deltaY > 0;

          const scrollAmount = element.childElementCount
            ? element.children[0].clientWidth
            : element.clientWidth * percentageToScroll;

          const left = spaceOnLeft + scrollAmount * directionMultiplier;

          element.scrollTo({
            left,
            behavior: "smooth",
          });

          const mayScrollRight =
            Math.floor(element.scrollWidth - element.offsetWidth) !==
            Math.floor(spaceOnLeft);

          const hasSpaceToScroll =
            (hasScrolledLeft && spaceOnLeft) ||
            (hasScrolledRight && mayScrollRight);

          if (hasSpaceToScroll) {
            event.preventDefault();
          }
        }
      };

      element.addEventListener("wheel", onMouseWheel);

      return () => {
        element.removeEventListener("wheel", onMouseWheel);
      };
    }
  }, []);

  return ref;
}
