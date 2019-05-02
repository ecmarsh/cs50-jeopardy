import React from 'react';
import styled from 'styled-components';
import { GlobalStyle } from '../styles/GlobalStyle';
import Themed from '../Theme';
import Header from './Header';
import Nav from './Nav';
import Meta from './Meta';

const StyledPage = styled.div`
  background: ${props => props.theme.lightGrey};
  color: ${props => props.theme.black};
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
  min-height: 100vh;
`;

const Inner = styled.div`
  padding: 1.5rem;
  font-family: ${props => props.theme.fontPrimary};
`;

const Page = props => {
  return (
    <Themed>
      <StyledPage>
        <Meta />
        <GlobalStyle />
        <Header />
        <Nav />
        <Inner>{props.children}</Inner>
      </StyledPage>
    </Themed>
  );
};

export default Page;
