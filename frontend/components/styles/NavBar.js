import styled from 'styled-components';

const NavBar = styled.div`
  background-color: ${props => props.theme.white};
  color: ${props => props.theme.black};
  box-shadow: 0 0.5rem 0.5rem rgba(100, 100, 100, 0.1);
  padding: 0.5rem;
  margin-bottom: 0.3rem;
  nav {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    h4 {
      font-weight: 400;
    }

    a,
    button {
      font-size: 0.9em;
      color: ${props => props.theme.darkGrey};
      transition: 0.1s ease-in;
      &:visited {
        color: ${props => props.theme.darkGrey};
      }
      &:hover,
      &:active {
        color: ${props => props.theme.primary};
      }
    }
  }
`;

export default NavBar;
