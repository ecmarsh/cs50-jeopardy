import React, { PureComponent } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { withUser } from './User';
import toTitleCase from '../lib/toTitleCase';
import Main from './styles/Main';
import FancyTitle from './styles/FancyTitle';
import Button from './styles/Button';
import Columns from './styles/Columns';
import MyGames from '../components/GamesUser';

const WelcomeMessage = styled.h2`
  margin-top: 1rem;
  padding: 1rem;
  font-weight: 400;
  color: ${props => props.theme.darkGrey};
`;

function Home({ me }) {
  if (me && me.permissions.includes('ADMIN')) {
    return (
      <Columns>
        <MyGames />
        <Welcome user={me} />
      </Columns>
    );
  }
  return <Welcome user={me} />;
}

const Welcome = ({ user }) => (
  <Main>
    <WelcomeMessage>
      Welcome{user ? `, ${toTitleCase(user.name)}` : `!`}
    </WelcomeMessage>
    <FancyTitle subheading>CS50 Edition</FancyTitle>
    <FancyTitle>JEOPARDY !</FancyTitle>
    {user && !user.permissions.includes('ADMIN') && (
      <Link href="/submit">
        <Button primary style={{ marginTop: '3rem' }}>
          Submit A Question
        </Button>
      </Link>
    )}
    {!user && (
      <Link href="/signin">
        <Button primary style={{ marginTop: '3rem' }}>
          Get Started
        </Button>
      </Link>
    )}
  </Main>
);

export default withUser(Home);
