import { createGlobalStyle, ThemeConsumer } from 'styled-components';
import { cs50Theme, classicTheme } from './themes';

export const GlobalStyle = createGlobalStyle`
  *, *:after, *:before  {
    margin: 0;
    padding: 0;
  }

  html {
    box-sizing: inherit;
    font-size: 62.5%;

    @media only screen and (max-width: 800px) {
        font-size: 55%;
    }
  }
  body {
    padding: 0;
    margin: 0 auto;
    text-align: center;
	  font-size: 1.6rem;
	  -webkit-font-smoothing: antialiased;
	  -moz-osx-font-smoothing: grayscale;
    box-sizing: border-box;
    line-height: 2;
    font-family: ${cs50Theme.fontPrimary};
    background-color: ${cs50Theme.darkGrey};
  }
  h1, h2, h3  {
    margin: 0;
    padding: 0;
    font-family: ${cs50Theme.fontDisplay};
    letter-spacing: 0;
    font-weight: 500;
  }
  ul {
    list-style: none;
  }
  a {
    text-decoration: none;
    transition: all .1s ease-out;
    &[aria-disabled='true']:hover {
      cursor: not-allowed;
    }
  }
`;

export { cs50Theme, classicTheme };
