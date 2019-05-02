import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Link from 'next/link';
import CategoryNames from './CategoryNames';
import { Heading } from './Views';
import Main from './styles/Main';
import Button from './styles/Button';
import { Divider } from './styles/Utilities';

const SINGLE_GAME_QUERY = gql`
  query SINGLE_GAME_QUERY($name: String) {
    game(name: $name) {
      id
      name
      createdAt
      isPublic
      user {
        id
        name
        email
      }
      teams {
        id
        name
        score
      }
      categories {
        id
        name
        categoryQuestions {
          id
          answered
          difficulty
        }
      }
      config {
        id
        hasDoubleJeopardy
        hasRoundTimer
        roundTime
        finalTime
      }
    }
  }
`;

function GameSetup({ gameName }) {
  GameSetup.propTypes = { gameName: PropTypes.string.isRequired };
  return (
    <Query query={SINGLE_GAME_QUERY} variables={{ name: gameName }}>
      {({ data: { game }, loading, error }) => {
        if (loading) return <p>Loading...</p>;
        if (error)
          return (
            <Main>
              <h2>Name Your Categories</h2>
              <Divider />
              <h3>
                <Link href="/">
                  <a>{`Select`}</a>
                </Link>{' '}
                or{' '}
                <Link href="start">
                  <a>{`Create A Game`}</a>
                </Link>{' '}
                {`First 👈`}
              </h3>
            </Main>
          );
        return (
          <Main>
            <Heading
              game={gameName}
              title={gameName}
              prevLinkText="My Games"
              prevLinkPath="/"
              nextLinkPath="/load"
              nextLinkText="Load Questions"
            />
            <Divider />
            <CategoryNames categories={game.categories}>
              <Link
                prefetch
                href={{
                  pathname: `/load`,
                  query: { game: gameName },
                }}
              >
                <Button secondary type="button" style={{ margin: '1rem auto' }}>
                  Choose Questions &rarr;
                </Button>
              </Link>
            </CategoryNames>
          </Main>
        );
      }}
    </Query>
  );
}

export default GameSetup;
export { SINGLE_GAME_QUERY };
