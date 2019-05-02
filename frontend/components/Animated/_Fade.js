import React, { memo } from 'react';
import { useSpring, animated } from 'react-spring';

const Fade = memo(({ children, on = true, cName, ...props }) => {
  const config = {
    mass: 1,
    tension: 120,
    friction: 40,
  };

  const springProps = useSpring({
    config,
    reset: true,
    opacity: on ? 1 : 0,
    from: { opacity: 0 },
  });

  return (
    <animated.div
      className={cName || 'controls'}
      style={{ ...springProps }}
      {...props}
    >
      {children}
    </animated.div>
  );
});

export default Fade;
