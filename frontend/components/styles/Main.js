import styled from 'styled-components';

const Main = styled.main`
  border-radius: 2rem;
  box-shadow: ${props => props.theme.bs};
  background: ${props => props.theme.white};
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  min-height: 85vh;
  h4 {
    text-transform: uppercase;
    margin: 1.2rem 0 0.5rem;
  }
  .canvas {
    display: flex;
    flex-wrap: wrap;
    min-height: 90vh;
    padding: 1rem;
  }
  .column-wrapper {
    min-height: 70%;
    width: calc(20% - 4px);
    padding: 2px;
    ul {
      height: 100%;
      display: flex;
      flex-direction: column;

      li:first-child {
        color: ${props => props.theme.primary};
        font-weight: 700;
        /*
        * Other list items in DropTarget
        */
      }
    }
  }
`;

export default Main;
