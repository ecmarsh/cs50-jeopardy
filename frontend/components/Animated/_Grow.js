import React, { memo } from 'react';
import { useSpring } from 'react-spring';
import Cover from '../styles/Cover';

const Grow = memo(({ children, active = false, ...props }) => {
  // Custom config
  const config = {
    mass: 1,
    tension: 190,
    friction: 23,
  };

  const springProps = useSpring({
    config,
    from: { opacity: 0, transform: `scale(0) translate3d(-50%, 0, 0)` },
    to: {
      opacity: active ? 1 : 0,
      transform: `scale(${active ? 1 : 0}) translate3d(-50%, 0, 0)`,
    },
  });

  return (
    <Cover style={{ ...springProps }} {...props}>
      {children}
    </Cover>
  );
});

export default Grow;
