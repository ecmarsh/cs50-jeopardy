import styled, { css } from 'styled-components';

const StyledTable = styled.table`
  margin: 0 auto;
  text-align: left;
  border-collapse: collapse;
  text-align: center;

  thead {
    background: ${props => props.theme.lightGrey};
    color: ${props => props.theme.darkGrey};
  }
  th,
  td {
    border: 1px solid ${props => props.theme.grey};
    padding: 1rem;
  }
  th {
    font-size: 0.7em;
    font-weight: 700;
  }
  td {
    font-size: 0.7em;
  }
  ${props =>
    props.strong &&
    css`
        font-weight: bolder;
        letter-spacing: 1px;
      td:first-child {
        text-align: left;
        color ${props => props.theme.darkGrey};
        text-transform: uppercase;
      }
    `}
  button {
    padding: 3px 1rem;
    border-color: ${props => props.theme.white};
    border-radius: 1px;
    background: ${props => props.theme.primary};
  }
`;

export default StyledTable;
