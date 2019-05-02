import React from 'react';
import { useSpring, animated, config } from 'react-spring';

const Ease = ({ children, ...props }) => {
  const { ...springProps } = useSpring({
    config: { ...config.gentle },
    transform: `translate3d(0, 0, 0)`,
    opacity: 1,
    from: { transform: `translate3d(0, 20%, 0)`, opacity: 0 },
  });
  return (
    <animated.form style={springProps} {...props}>
      {children}
    </animated.form>
  );
};

export default Ease;
