import styled, { css } from 'styled-components';

const BoardSquare = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-radius: 5px;

  a,
  div {
    background-color: ${props => props.theme.primary};
    background-image: linear-gradient(
      35deg,
      ${props => props.theme.primaryDark} 20%,
      ${props => props.theme.primary} 80%,
      ${props => props.theme.primaryDark}
    );
    background-size: cover;
    background-position: center center;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    color: ${props => props.theme.gold};
    font-size: calc((100vw - 6rem) / 20);
    letter-spacing: 1px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 2px;
    transition: border 0.2s ease;
    &:not(.category-title):hover {
      cursor: pointer;
      border: 1px solid ${props => props.theme.gold};
      border: 1px solid rgba(255, 255, 255, 1);
    }
  }

  ${props =>
    props.answered &&
    css`
      span.question-value {
        color: transparent;
      }

      div {
        border: 1px solid rgba(255, 255, 255, 0.4);
        box-shadow: none;

        &:not(.category-title):hover {
          cursor: not-allowed;
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: none;
        }
      }
    `}

  ${props =>
    props.isFinal &&
    css`
      width: 100%;
      height: 0%;
      border: none;
      background: ${props => props.theme.primaryDark};
      div {
        color: ${props => props.theme.primaryDark};
        font-size: 0;
      }
    `}
`;

const TitleSquare = styled(BoardSquare)`
  height: 14%;
  .category-title {
    background-image: linear-gradient(
      to top,
      ${props => props.theme.primaryDark} 20%,
      ${props => props.theme.primary} 80%,
      ${props => props.theme.primaryDark}
    );
    color: white;
    font-size: 1.5vw;
    line-height: 1.1;
    box-shadow: none;
    h3 {
      letter-spacing: 1px;
      text-transform: uppercase;
    }
  }
  &:hover {
    cursor: auto;
  }
  ${props =>
    props.isFinal &&
    css`
      border: none;
      height: 100%;
      div {
        align-items: flex-start;
      }

      .category-title {
        font-size: 5vw;
      }
    `}
`;

export default BoardSquare;
export { TitleSquare };
