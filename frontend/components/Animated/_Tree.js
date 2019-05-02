import React, { memo, useState, useRef, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import styled from 'styled-components';
import * as Icons from '../styles/icons';
import Frame from '../styles/Frame';
import useMeasure from '../../lib/useMeasure';
import hexToRgb from '../../lib/hexToRgb';

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => void (ref.current = value), [value]);
  return ref.current;
}

const Content = styled(animated.div)`
  will-change: transform, opacity, height;
  margin-left: 6px;
  padding-left: 1.4rem;
  border-left: 1px dashed ${props => `rgba(${hexToRgb(props.theme.red)}, 0.4)`};
  overflow: hidden;
  font-size: 1.4rem;
`;

const Tree = memo(({ children, name, style, open = false }) => {
  const [isOpen, setOpen] = useState(open);
  const previous = usePrevious(isOpen);
  const [bind, { height: viewHeight }] = useMeasure();
  const { height, opacity, transform } = useSpring({
    from: { height: 0, opacity: 0, transform: 'translate3d(20px,0,0)' },
    to: {
      height: isOpen ? viewHeight : 0,
      opacity: isOpen ? 1 : 0,
      transform: `translate3d(${isOpen ? 0 : 20}px,0,0)`,
    },
  });
  const Icon =
    Icons[`${children ? (isOpen ? 'Minus' : 'Plus') : 'Close'}SquareO`];
  const toggle = {
    width: '1em',
    height: '1em',
    marginRight: 10,
    cursor: 'pointer',
    verticalAlign: 'middle',
  };
  return (
    <Frame>
      <Icon
        style={{ ...toggle, opacity: children ? 1 : 0.3 }}
        onClick={() => setOpen(!isOpen)}
      />
      <span style={{ verticalAlign: 'middle', ...style }}>{name}</span>
      <Content
        style={{
          opacity,
          height: isOpen && previous === isOpen ? 'auto' : height,
        }}
      >
        <animated.div style={{ transform }} {...bind}>
          {children}
        </animated.div>
      </Content>
    </Frame>
  );
});

export default Tree;
