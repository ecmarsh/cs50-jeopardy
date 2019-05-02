import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Error from './ErrorMessage';

const GAMES_QUERY = gql`
  query GAMES_QUERY {
    games {
      id
      name
      isPublic
      user {
        id
      }
    }
  }
`;

const GameOptions = ({ htmlName, handler }) => (
  <Query query={GAMES_QUERY}>
    {({ data: { games }, loading, error }) => {
      if (loading) return 'Loading...';
      if (error) return <Error error={error} />;
      return (
        <select
          name={htmlName}
          id={htmlName}
          autoFocus
          required
          onChange={handler}
          defaultValue="Select Game"
        >
          <option disabled>Select Game</option>
          {games.map(game => (
            <option key={game.id} value={game.name}>
              {game.name}
            </option>
          ))}
        </select>
      );
    }}
  </Query>
);

GameOptions.propTypes = {
  htmlName: PropTypes.string.isRequired,
  handler: PropTypes.func.isRequired,
};

export default GameOptions;
export { GAMES_QUERY };
