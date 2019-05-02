import React from 'react';
import { useSpring, animated, config } from 'react-spring';

function Loud({ children, off = false }) {
  const { x, ...springProps } = useSpring({
    config: { ...config.gentle },
    delay: 100,
    x: 1,
    fontSize: off ? '4vw' : '6vw',
    textTransform: 'uppercase',
    from: { x: 0 },
  });
  return (
    <animated.h1
      style={{
        ...springProps,
        opacity: x.interpolate({ output: [0, 1] }),
        transform: x
          .interpolate({
            range: [0, 0.7, 1],
            output: [1, 1.4, 1],
          })
          .interpolate(x => `scale(${x})`),
      }}
    >
      {children}
    </animated.h1>
  );
}

export default Loud;
