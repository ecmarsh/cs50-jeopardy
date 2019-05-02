import styled from 'styled-components';

const BoardCanvas = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  width: 100%;
  height: 100%;
  margin: 0 auto 1rem;

  div.category-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: stetch;
  }
`;

export default BoardCanvas;
