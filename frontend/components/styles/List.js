import styled from 'styled-components';

const LeftList = styled.div`
  text-align: left;
  border-radius: 2rem 2rem 0 0;
  box-shadow: ${props => props.theme.bs};
  max-width: 25vw;
  background: ${props => props.theme.white};
  min-height: 85vh;
  max-height: calc(${props => props.theme.maxHeight} + 9rem);
  transform: translate3d(0, 0, 0);

  .heading {
    padding: 0.5rem 1.3rem;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    min-height: 8rem;
    width: 95%;
    max-width: 23vw;
    a,
    a:visted {
      color: ${props => props.theme.primary};
    }
    h3 {
      margin-left: 0.5rem;
      margin-top: 0.5rem;
      font-family: ${props => props.theme.fontPrimary};
    }
    hr {
      opacity: 0.5;
      position: relative;
      z-index: -1;
      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
    }
  }

  ul {
    overflow: scroll;
    padding: 1rem;
    list-style: none;
    padding: 0;
    line-height: 1.5;
    z-index: 1;
    position: relative;
    top: 9rem;
    padding-bottom: 1rem;
    max-height: calc(${props => props.theme.maxHeight} - 2rem);
  }
`;

export default LeftList;
