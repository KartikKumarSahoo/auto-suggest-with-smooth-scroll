export const debounce = (fn, ms = 0) => {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

export const scrollIntoView = (containerEle, targetEle) => {
  const {
    top: contTop,
    bottom: contBottom,
  } = containerEle.getBoundingClientRect();
  const { top: eleTop, bottom: eleBottom } = targetEle.getBoundingClientRect();
  const contScrollTop = containerEle.scrollTop;

  // Check if the element is alreay in view port, if yes, do nothing.
  if (eleTop > contTop && eleBottom < contBottom) return;

  // Figure out which end the target element is close to.
  const closestEnd =
    Math.abs(eleTop - contBottom) < Math.abs(eleTop - contTop)
      ? 'bottom'
      : 'top';

  if (closestEnd === 'bottom') {
    smoothScroll(
      containerEle,
      contScrollTop + Math.abs(eleBottom - contBottom),
    );
  } else {
    smoothScroll(containerEle, contScrollTop - Math.abs(contTop - eleTop));
  }
};

export const smoothScroll = (scrollEle, position) => {
  if ('scrollBehavior' in document.body.style) {
    scrollEle.scrollTo({
      top: position,
      behavior: 'smooth',
    });
    return;
  }

  // Invoke custom smooth scrolling behavior if browser doesn't support.
  customSmoothScroll(scrollEle, position);
};

export const customSmoothScroll = (
  scrollEle,
  position,
  animationDuration = 250,
) => {
  let startTime;
  const contScrollTop = scrollEle.scrollTop;
  const distance = Math.abs(contScrollTop - position); // Distance to travel.

  const rAFCallback = timestamp => {
    startTime = startTime || timestamp; // Initialize startTime if not already.

    const timeElapsedSinceStart = timestamp - startTime;
    const progress = timeElapsedSinceStart / animationDuration;
    const safeProgress = Math.min(progress.toFixed(2), 1); // 2 decimal points
    const intervalDistance = safeProgress * distance;

    // Move the scroll position by interval.
    if (contScrollTop > position) {
      // Scroll UP
      scrollEle.scrollTo(0, contScrollTop - intervalDistance);
    } else {
      // Scroll DOWN
      scrollEle.scrollTo(0, contScrollTop + intervalDistance);
    }

    // we need to progress to reach 100%
    if (safeProgress !== 1) {
      requestAnimationFrame(rAFCallback);
    }
  };

  requestAnimationFrame(rAFCallback);
};
