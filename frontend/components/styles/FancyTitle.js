import styled, { css } from 'styled-components';
import hexToRgb from '../../lib/hexToRgb';

const FancyTitle = styled.h1`
  background-image: linear-gradient(
    to top,
    ${props => props.theme.primary} 45%,
    rgba(${props => hexToRgb(props.theme.secondary)}, 0.9) 70%,
    ${props => props.theme.primary} 80%
  );
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  font-weight: 700;
  letter-spacing: 2px;
  line-height: 1.5;
  margin: 0 auto;
  font-family: ${props => props.theme.fontDisplay};
  font-size: 8rem;

  @media screen and (max-width: 700px) {
    font-size: 5rem;
  }

  ${props =>
    props.subheading &&
    css`
      line-height: 1;
      margin-top: 4rem;
      font-size: 2.2em;
      font-style: italic;
      letter-spacing: 0;
      @media screen and (max-width: 700px) {
        font-size: 3rem;
      }
    `}
`;

export default FancyTitle;
