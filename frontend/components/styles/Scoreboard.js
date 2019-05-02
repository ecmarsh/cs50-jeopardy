import styled, { css } from 'styled-components';

const Scoreboard = styled.div`
  position: absolute;
  top: -4rem;
  right: 3rem;
  color: ${props => props.theme.white};
  display: flex;
  justify-content: space-between;
  min-height: 8rem;
  max-height: 10rem;
  padding: 1.5rem 5.5rem 1rem 3rem;
  z-index: 1000;
  line-height: 1.3;

  .team-label {
    position: relative;
    color: ${props => props.theme.lightGrey};
    text-decoration: underline;
    font-size: 1.8rem;
    margin: 1rem 0 0;
    padding: 0;
    opacity: 0.8;
    transform: translateX(5%);
    transition: 0.14s ease-out;
  }

  .team-score {
    padding: 0.5rem 0;
    margin: 0;
    padding: 0;
    font-size: 3rem;
    opacity: 0.8;
    transition: 0.3s ease-out;
    font-feature-settings: “tnum”;
    font-variant-numeric: tabular-nums;
  }
`;

export const TeamContainer = styled.div`
  padding-left: 4rem;
  text-align: left;
  ${props =>
    props.chosen &&
    css`
      .team-label,
      .team-score {
        color: ${props => props.theme.gold} !important;
        opacity: 1;
        transition: 0.22s cubic-bezier(0.78, 0.15, 0.54, 1.11);
      }
    `}
  ${props =>
    props.prevChosen &&
    css`
      .team-label::before {
        content: '';
        border-radius: 50%;
        background: ${props => props.theme.gold};
        width: 8px;
        height: 8px;
        position: absolute;
        left: -2rem;
        top: 35%;
        margin: 2px;
      }
    `}
`;

export default Scoreboard;
