import React from 'react';
import { useSpring, animated, config } from 'react-spring';
import formatScore from '../../lib/formatScore';

function Tally({ score, ...props }) {
  const { y, ...springProps } = useSpring({
    config: config.stiff,
    y: 0,
    opacity: 1,
    from: { opacity: 0, y: 8 },
  });
  return (
    <animated.p
      className="team-score"
      style={{ transform: y.interpolate(y => `translate3d(0, ${y}px, 0)`) }}
      {...props}
    >
      <animated.span style={{ ...springProps }}>
        {formatScore(score)}
      </animated.span>
    </animated.p>
  );
}

export default Tally;
