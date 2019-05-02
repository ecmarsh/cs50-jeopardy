import styled, { css } from 'styled-components';
import { animated } from 'react-spring';

const ActionBar = styled(animated.div)`
  will-change: transform;
  background: ${props => props.theme.black};
  position: fixed;
  z-index: 101;
  bottom: 1rem;
  min-width: 60rem;
  min-height: 4rem;
  padding: 0.5rem 2.5rem;
  display: flex;
  align-items: center;
  border: 1px solid #fff;

  .bar-icon {
    position: relative;
    img {
      height: 3rem;
      opacity: 0.6;
      position: absolute;
      top: calc(50%);
      transform: translateY(-50%);
    }
  }

  .inner {
    width: 100%;
    max-width: 144rem;
    display: flex;
    justify-content: space-around;
    align-items: center;

    a,
    button {
      color: ${props => props.theme.white};
      opacity: 0.7;
      font-size: 1.4rem;
      padding: 0 0.5rem;
      &:hover {
        opacity: 1;
      }
    }
  }

  &.left {
    box-shadow: 3px -2px 5px 0px rgba(255, 255, 255, 0.25);

    .bar-icon img {
      right: 1rem;
    }
    .inner {
      padding-right: 10rem;
    }
  }

  &.right {
    box-shadow: -3px -2px 5px 0px rgba(255, 255, 255, 0.25);

    .bar-icon img {
      left: 1rem;
    }
    .inner {
      padding-left: 10rem;
    }
  }
`;

export default ActionBar;
