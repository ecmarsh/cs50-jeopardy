import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import { SINGLE_GAME_QUERY } from './GameSetup';
import { UPDATE_PUBLIC_GAME_MUTATION } from './GameLaunch';
import Error from './ErrorMessage';
import { Alert, Heading } from './Views';
import Main from './styles/Main';
import Button from './styles/Button';
import { Divider } from './styles/Utilities';

function GameLocked({ game, headingProps }) {
  const unpublishGame = async (e, unpublishMutation) => {
    e.preventDefault();
    const message = `Are you sure you want to unlock and edit this game again?`;
    if (confirm(message)) {
      const res = await unpublishMutation({
        variables: { gameName: game, isPublic: false },
        refetchQueries: [
          { query: SINGLE_GAME_QUERY, variables: { name: game } },
        ],
      });
      Router.push({
        pathname: '/load',
        query: { game },
      });
      console.info('Game unlocked');
    }
  };

  const alertMessage = `Since this game has been published for others to play, editing questions is locked. You can unpublish your game, but anyone who has played and saved your game for studying will lose their data.`;

  return (
    <Main>
      <Heading game={game} {...headingProps} />
      <Divider />
      <div style={{ width: '80%', margin: '0 auto' }}>
        <Alert message="Editing Questions is Locked!" noBg>
          <p style={{ padding: '2rem 15%' }}>{alertMessage}</p>
          <Mutation mutation={UPDATE_PUBLIC_GAME_MUTATION}>
            {(mutate, res) => {
              if (res.error) return <Error error={res.error} />;
              if (res.loading) return <p>Loading...</p>;
              return (
                <Button
                  secondary
                  style={{ display: 'block', margin: '2rem auto' }}
                  onClick={e => unpublishGame(e, mutate)}
                  data-test="unpublish-game-button"
                >
                  Unpublish Game
                </Button>
              );
            }}
          </Mutation>
        </Alert>
      </div>
    </Main>
  );
}
GameLocked.propTypes = {
  game: PropTypes.string.isRequired,
  headingProps: PropTypes.object,
};

export default GameLocked;
