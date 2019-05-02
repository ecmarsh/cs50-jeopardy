import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { pluck } from 'ramda';
import { USER_GAMES_QUERY } from './GamesUser';
import ErrorMessage from './ErrorMessage';
import { Alert } from './Views';
import Main from './styles/Main';

const OwnershipRequired = ({ children, game, ...props }) => (
  <Query query={USER_GAMES_QUERY}>
    {({ data, loading, error }) => {
      if (loading) return <Loading />;
      if (error) return <Error error={error} />;
      // Check if owner of game
      const hasGames = Boolean(data.myGames);
      const isOwner = pluck('name', data.myGames.includes(game));
      if (!hasGames || !isOwner) return <AccessForbidden />;
      // Must be game owner
      return children;
    }}
  </Query>
);
OwnershipRequired.propTypes = {
  children: PropTypes.element.isRequired,
  game: PropTypes.string.isRequired,
};

function Loading() {
  return (
    <Main>
      <p>Loading...</p>
    </Main>
  );
}

function Error(error) {
  return (
    <Main>
      <ErrorMessage error={error} />
    </Main>
  );
}

function AccessForbidden() {
  const message = `Access forbidden. You must be the game owner.`;
  return (
    <Main>
      <Alert message={message} noBg />
    </Main>
  );
}

export default OwnershipRequired;
