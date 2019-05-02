import styled, { css } from 'styled-components';

export const TextEmph = styled.span`
  font-weight: bolder;
  color: ${props => props.theme.primary};
  font-size: 1.3em;
`;

export const TextOnOff = styled(TextEmph)`
  color: ${props => props.theme.green};
  margin-left: 5px;
  &:after {
    content: '✅';
    margin-left: 5px;
  }
  ${props =>
    props.textMuted &&
    css`
      color: ${props => props.theme.darkGrey};
      opacity: 0.7;

      &:after {
        content: '❌';
        margin-left: 5px;
      }
    `}
`;

export const TextMuted = styled.span`
  opacity: 0.8;
  font-size: 0.8em;
  display: inline;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;

  ${props =>
    props.smaller &&
    css`
      font-size: 0.7em;
    `}
  ${props =>
    props.larger &&
    css`
      font-size: 0.9em;
    `}
  ${props =>
    props.italic &&
    css`
      font-style: italic;
    `}
  ${props =>
    props.hidden &&
    css`
      display: inline;
      opacity: 0;
      transition: 0.3s ease-in-out;
    `}
`;

export const TextLarger = styled.span`
  font-size: 1.3em;
`;

export const TextUnderlined = styled.span`
  text-decoration: underline;
`;

export const Divider = styled.hr`
  width: 80%;
  opacity: 0.5;
  margin: 1rem auto;
`;
