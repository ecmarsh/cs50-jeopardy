import React from 'react';
import { useSpring, animated, config } from 'react-spring';

function Unfocus({ children, off = false, ...rest }) {
  const springProps = useSpring({
    config: { ...config.gentle },
    opacity: off ? 0.8 : 1,
    fontSize: '4.5vh',
    transform: off ? 'translate3d(0, 0, 0)' : 'translate3d(0, 0, 0)',
    from: { opacity: 0, transform: 'translate3d(0, 0, 0)' },
  });
  return (
    <animated.p
      className={`question${off ? '--unfocused' : ''}`}
      style={springProps}
      {...rest}
    >
      {children}
    </animated.p>
  );
}

export default Unfocus;
