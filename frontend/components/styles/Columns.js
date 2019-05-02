import styled, { css } from 'styled-components';

const Columns = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  column-gap: 1.3rem;
  margin: 0 auto;
  min-width: 100%;
  min-height: calc(100vh - 10rem);

  ${props =>
    props.evenSplit &&
    css`
      grid-template-columns: repeat(2, 1fr);
    `}
`;

export default Columns;
