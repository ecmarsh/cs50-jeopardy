import styled from 'styled-components';
import { animated } from 'react-spring';

const Cover = styled(animated.div)`
  position: fixed;
  top: 9.5rem;
  left: 50%;
  z-index: 1000;
  width: 100%;
  transform-origin: left;
  box-shadow: 0px 0rem 6px 4px rgba(0, 0, 0, 0.6);
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
  height: calc(100vh - 17rem);
  background-color: ${props => props.theme.primary};
  color: ${props => props.theme.white};
  background-image: linear-gradient(
    45deg,
    ${props => props.theme.primaryDark} 15%,
    ${props => props.theme.primary} 50%,
    ${props => props.theme.primaryDark} 95%,
    ${props => props.theme.primary}
  );
  .fullscreen__inner {
    height: 100%;
    display: grid;
    grid-template-rows: fit-content(15%) auto fit-content(10%);
    grid-template-columns: 10% 80% 10%;
    grid-auto-flow: row;
  }

  .titles {
    grid-row: 1 / 2;
    grid-column: 2 / 3;
    align-self: end;
    &__inner {
      margin-top: 2rem;
      font-size: 1.5em;
      display: flex;
      justify-content: space-around;
      align-items: center;
      h3 {
        line-height: 1.2;
        color: #ffdb6d;
      }
    }
  }

  .main__display {
    align-self: center;
    grid-row: 2 / 3;
    grid-column: 2 / 3;

    h1 {
      font-size: 6vw;
    }
    .question,
    .answer {
      font-size: 4.5vh;
      padding: 1rem 8%;
      line-height: 1.3;
      letter-spacing: 2px;
      text-transform: uppercase;

      &--unfocused {
        padding-bottom: 3rem;
        text-transform: uppercase;
        line-height: 1.1;
      }
      &--mounted {
        font-size: 3.5vh;
      }
    }
    .other {
      font-size: 4vh;

      span {
        font-weight: bolder;
        letter-spacing: 2px;
      }
    }
    .prompt {
      font-size: 3vh;
      font-style: italic;
      color: ${props => props.theme.lightGrey};
    }
    .answer {
      color: ${props => props.theme.gold};
    }
    .congrats {
      line-height: 1.5;
      letter-spacing: 2px;
      font-size: 6vh;
    }
  }

  .controls {
    grid-row: 3 / 4;
    grid-column: 2 / 3;
    margin-bottom: 2rem;
    font-size: 1.5em;
    &__ctas {
      display: flex;
      width: 50%;
      padding: 1rem 0;
      align-items: center;
      justify-content: space-around;
      margin: 0 auto;
    }
    &__message {
      color: ${props => props.theme.lightGrey};
      font-style: italic;
    }
  }
`;

export default Cover;
