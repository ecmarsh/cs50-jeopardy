import styled from 'styled-components';

const TitleBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 101;
  width: 100%;
  background-color: ${props => props.theme.black};
  min-height: 9rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme.black};

  .inner {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0 3rem;
    max-width: ${props => props.theme.maxWidth};
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .title {
    display: flex;
    align-items: center;

    h1 {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      line-height: 1;
      color: ${props => props.theme.white};
      font-size: 3.5rem;
    }
    h2 {
      color: ${props => props.theme.lightGrey};
      line-height: 1.5;
      margin-left: 2rem;
      font-size: 2.6rem;
      font-weight: 500;
    }
  }
`;

export default TitleBar;
