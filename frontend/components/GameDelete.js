import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import * as R from 'ramda';
import { USER_GAMES_QUERY } from './GamesUser';
import Button from './styles/Button';
import { CloseSquareO } from './styles/icons';

const DELETE_GAME_MUTATION = gql`
  mutation DELETE_GAME_MUTATION($name: String!) {
    deleteGame(name: $name) {
      name
    }
  }
`;

const confirmationMessage = `
Are you sure you want to delete this game?\n
Associated teams, categories, and questions will also be deleted.
`;

const DeleteGame = ({ gameName, children }) => (
  <Mutation mutation={DELETE_GAME_MUTATION}>
    {deleteGame => (
      <Button
        close
        onClick={async e => {
          e.preventDefault();
          if (confirm(confirmationMessage)) {
            await deleteGame({
              variables: { name: gameName },
              update: (cache, { data: { deleteGame } }) => {
                // Read cache
                const query = { query: USER_GAMES_QUERY };
                const { myGames } = cache.readQuery(query);
                // Filter game out from UI
                const byGameName = R.propEq('name', deleteGame.name);
                const updatedGames = R.reject(byGameName, myGames);
                // Write back w/ updated data
                cache.writeQuery({
                  data: { myGames: updatedGames },
                  ...query,
                });
              },
            });
          }
        }}
      >
        {children}
      </Button>
    )}
  </Mutation>
);

DeleteGame.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
    .isRequired,
  gameName: PropTypes.string.isRequired,
};
DeleteGame.defaultProps = {
  children: '❌',
};

export default DeleteGame;
export { DELETE_GAME_MUTATION };
