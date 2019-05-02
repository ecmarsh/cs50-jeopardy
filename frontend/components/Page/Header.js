import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Button from '../styles/Button';
import NProgress from 'nprogress';
import Router from 'next/router';
import { ThemeToggler } from '../Theme';

Router.onRouteChangeStart = () => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => {
  NProgress.done();
};

Router.onRouteChangeError = () => {
  NProgress.done();
};

const StyledHeader = styled.div`
  background-color: ${props => props.theme.white};
  max-width: ${props => props.theme.maxWidth};
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 3rem;
  padding-top: 1rem;
  margin: 0 auto;
  @media screen and (min-width: 900px) {
    padding-left: 5rem;
    padding-right: 5rem;
  }
  @media screen and (max-width: 900px) {
    padding-left: 2rem;
    padding-right: 2rem;
  }
`;
const Logo = styled.img.attrs(props => ({
  src: `/static/icon${props.theme.classic ? '-jtheme' : ''}.png`,
}))`
  max-height: 3rem;
  max-width: 3rem;

  :hover {
    cursor: pointer;
  }
`;

const Header = props => (
  <StyledHeader>
    <Link href="/">
      <Logo alt="cs50 jeopardy logo" />
    </Link>
    <ThemeToggler style={{ fontSize: '.8em' }} />
  </StyledHeader>
);

export default Header;
