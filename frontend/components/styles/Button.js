import styled, { css } from 'styled-components';

const Button = styled.button`
  font-family: ${props => props.theme.fontPrimary};
  color: white;
  border-radius: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: .2s ease;

  &:hover {
    cursor: pointer;
  }
  &:focus {
    cursor: pointer;
    outline: ${props => props.theme.secondary} auto 3px;
  }

${props =>
  props.primary &&
  css`
    display: block;
    margin: 1rem auto;
    padding: 1.5rem 3rem;
    text-transform: uppercase;
    font-size: 1.8rem;
    background-color: ${props => props.theme.primary};
    background-image: linear-gradient(
      to top,
      ${props => props.theme.primaryDark} 12%,
      ${props => props.theme.primary} 88%,
      ${props => props.theme.white}
    );
    border: 1px solid ${props => props.theme.primary};
    &.block {
      min-width: 22rem;
      max-width: 30rem;
      font-weight: 700;
      letter-spacing: 2px;
    }
    &:hover,
    &:focus {
      background-image: linear-gradient(
        to top,
        ${props => props.theme.primaryDark} 12%,
        ${props => props.theme.primaryOffset} 40%,
        ${props => props.theme.primary} 89%,
        ${props => props.theme.white}
      );
      background-image: linear-gradient(
        to top,
        ${props => props.theme.primaryDark} 30%,
        ${props => props.theme.primary} 88%,
        ${props => props.theme.white}
      );
    }
  `}

${props =>
  props.secondary &&
  css`
    background: ${props => props.theme.black};
    background-image: linear-gradient(
      to top,
      #1f1f1f 88%,
      ${props => props.theme.lightGrey}
    );
    padding: 1.5rem 3rem;
    border-color: black;

    &:hover {
      background-image: linear-gradient(
        to top,
        #111 88%,
        ${props => props.theme.lightGrey}
      );
    }
  `}

${props =>
  props.game &&
  css`
    background: ${props => props.theme.lightGrey};
    background-image: linear-gradient(
      to top,
      #9e9e9e 88%,
      ${props => props.theme.lightGrey}
    );
    padding: 1rem 3rem;
    margin: 3px 0;
    border-color: #999;
    color: ${props => props.theme.primaryDark};
    font-size: 1.3rem;
    letter-spacing: 1px;
    font-weight: 700;

    &:hover {
      background-image: linear-gradient(
        to top,
        #999 88%,
        ${props => props.theme.lightGrey}
      );
    }
  `}

${props =>
  props.tertiary &&
  css`
    background: none;
    border: none;
    color: #999;
    letter-spacing: 0;
    font-size: 1.4rem;
    text-transform: capitalize;

    &:hover {
      color: ${props => props.theme.primary};
    }

    &:active,
    &:focus {
      outline: none;
    }
  `}

  ${props =>
    props.playing &&
    css`
      color: ${props => props.theme.gold}!important;
    `}

  &.button--sound {
    font-weight: bolder;
    text-decoration: line-through;
    &::after {
      content: "❌";
    padding-left: 3px;
    }

  ${props =>
    props.on &&
    css`
      color: ${props => props.theme.green}!important;
      text-decoration: none;
      &::after {
        content: '✅';
      }
    `}
  }

${props =>
  props.close &&
  css`
    position: absolute;
    top: 0;
    right: 0;
    background: none;
    margin: 5px 8px;
    border: none;
    color: ${props => props.theme.grey};
    fill: ${props => props.theme.red};
    height: 1.2em;
    width: 1.2em;
  `}
`;

export default Button;
