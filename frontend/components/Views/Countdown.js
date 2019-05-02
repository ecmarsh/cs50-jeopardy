import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes, css } from 'styled-components';

const countdownSmall = keyframes`
  from {
      stroke-dashoffset: 0;
    }
    to {
      stroke-dashoffset: 13.2rem;
    }
`;
const countdownLarge = keyframes`
  from {
      stroke-dashoffset: 0;
    }
    to {
      stroke-dashoffset: 23.9rem;
    }
`;

const StyledCountdown = styled.div`
  position: relative;
  margin: auto;
  height: ${props => props.vb}rem;
  width: ${props => props.vb}rem;
  text-align: center;
  border-radius: 100%;
  box-shadow: 0 0 1rem 3px rgba(255, 255, 255, 0.4);
  .countdown__number {
    color: white;
    display: block;
    line-height: ${props => props.vb}rem;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    font-size: ${props => props.vb / 2}rem;
    z-index: 999;
  }

  svg {
    position: absolute;
    top: 0;
    right: 0;
    width: ${props => props.vb}rem;
    height: ${props => props.vb}rem;
    fill: none;
    transform: rotateY(-180deg) rotateZ(-90deg);
  }

  svg circle {
    stroke-linecap: butt;
    stroke-width: 4px;
    stroke: ${props => props.theme.gold};
    stroke-dasharray: ${props => (props.vb * 5 - 2) * 6.28}; // 2πr
    stroke-dashoffset: 0px;
  }

  ${props =>
    props.large &&
    css`
      svg circle {
        fill: rgba(0, 0, 0, 0.2);
        animation: ${countdownLarge} ${props => props.animationTime}s linear
          forwards;
      }
    `}
  ${props =>
    !props.large &&
    css`
      svg circle {
        fill: rgba(0, 0, 0, 0.6);
        animation: ${countdownSmall} ${props => props.animationTime}s linear
          forwards;
      }
    `}
`;

const Countdown = ({ animationTime, timeRemaining, round }) => {
  const vb = round < 3 ? 4.6 : 8; // determine size (viewBox)
  return (
    <StyledCountdown animationTime={animationTime} vb={vb} large={round === 3}>
      <div className="countdown__number">{timeRemaining}</div>
      <svg>
        <circle r={vb * 5 - 2} cx="50%" cy="50%" />
      </svg>
    </StyledCountdown>
  );
};

Countdown.propTypes = {
  animationTime: PropTypes.number.isRequired,
  timeRemaining: PropTypes.number,
  round: PropTypes.number.isRequired,
};

export default Countdown;
