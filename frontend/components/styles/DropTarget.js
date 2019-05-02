import styled from 'styled-components';

const DropTarget = styled.li`
  position: relative;
  border-radius: 2rem;
  box-shadow: inset ${props => props.theme.bs};
  margin: 1% 0;
  height: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${props => props.theme.lightGrey};
  background: ${props => props.theme.white};
  &.--isLoaded {
    background: ${props => props.theme.primary};
    color: ${props => props.theme.white};
    box-shadow: inset 1px 5px 1rem 5px rgba(255, 255, 255, 0.3);
    div {
      max-height: 80%;
      overflow-y: scroll;
      font-size: 1.3rem;
      padding: 10% 6% 2% 6%;
      text-align: center;
      line-height: 1.4;
    }
  }
  button {
    font-size: 1.3rem;
    right: 2px;
    top: 2px;
  }
`;

export default DropTarget;
