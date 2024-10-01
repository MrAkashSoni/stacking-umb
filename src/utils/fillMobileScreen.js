export function fillMobileScreen(element, offsetTop) {
  if (element && window) {
    element.style.display = "none";

    if (offsetTop) {
      element.style.top = `${offsetTop}px`;
    }

    const height = offsetTop
      ? window.innerHeight - offsetTop
      : window.innerHeight;

    element.style.height = `${height}px`;

    element.style.removeProperty("display");
  }
}
