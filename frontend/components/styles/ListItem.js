import styled, { css } from 'styled-components';
import hexToRgb from '../../lib/hexToRgb';

const LeftListItem = styled.li`
  position: relative;
  padding: 0.5rem 1rem;
  border-radius: 1.5rem;
  font-size: 0.75em;
  ${props =>
    props.isInView &&
    css`
      background-color: rgba(${props => hexToRgb(props.theme.primary)}, 0.6);
      a,
      a:visited,
      a:active {
        color: ${props => props.theme.white};
      }
    `}

  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.grey};
  }
  a {
    color: ${props => props.theme.darkGrey};
  }
  :hover {
    box-shadow: ${props => props.theme.bs};
  }
`;

export default LeftListItem;
