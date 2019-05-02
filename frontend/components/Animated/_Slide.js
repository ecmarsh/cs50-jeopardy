import React, { memo } from 'react';
import { useSpring } from 'react-spring';
import ControlBar from '../styles/Controls';

const Slide = memo(({ children, hovered = false, flip = false, ...props }) => {
  // TranslateX
  const xFrom = flip ? 100 : -100,
    xTo = 0;

  // Positioned right/left
  const posFrom = flip ? { right: `10rem` } : { left: `10rem` },
    posTo = flip
      ? { right: hovered ? `-1.5rem` : `10rem` }
      : { left: hovered ? `-1.5rem` : `10rem` };

  // Custom config
  const config = {
    mass: 1,
    tension: 200,
    friction: 22,
  };

  const springProps = useSpring({
    config,
    from: { ...posFrom, transform: `translate3d(${xFrom}%,0,0)` },
    to: {
      ...posTo,
      transform: `translate3d(${hovered ? xTo : xFrom}%,0,0)`,
    },
  });

  return (
    <ControlBar style={{ ...springProps }} {...props}>
      {children}
    </ControlBar>
  );
});

export default Slide;
