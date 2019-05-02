import React from 'react';
import { useSpring, animated, config } from 'react-spring';

function Shift({ children, cName, on = true, ...rest }) {
  const springProps = useSpring({
    config: { ...config.gentle },
    opacity: on ? 1 : 0,
    transform: `translate3d(${on ? 0 : 10}px, 0, 0)`,
    from: { opacity: 0, transform: `translate3d(10px, 0, 0)` },
  });
  return (
    <animated.p className={cName} style={springProps} {...rest}>
      {children}
    </animated.p>
  );
}

export default Shift;
