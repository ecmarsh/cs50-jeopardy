import React from 'react';
import { Query } from 'react-apollo';
import User from './User';
import { SINGLE_GAME_QUERY } from './GameSetup';
import { GAME_SUMMARY_QUERY } from './GameSummary';
import GameScreen from './GameScreen';
import Error from './ErrorMessage';
import { Alert } from './Views';
import Main from './styles/Main';

function GameContainer({ gameName, round }) {
  return (
    <User>
      {({ data: { me } }) => (
        <Query query={SINGLE_GAME_QUERY} variables={{ name: gameName }}>
          {({ data: { game }, loading, error }) => {
            if (loading) return <Main>Loading...</Main>;
            if (error)
              return (
                <Main>
                  <Error error={error} />
                </Main>
              );
            const isOwner = me.id === game.user.id;
            // Owner hasn't published and user is not game owner
            if (!isOwner && !game.isPublic) {
              return (
                <Main>
                  <Alert
                    message="Sorry, you are not allowed to play this game."
                    noBg
                  />
                </Main>
              );
            }
            // Ok to play, check that questions are loaded
            return (
              <Query query={GAME_SUMMARY_QUERY} variables={{ gameName }}>
                {({
                  data: { categoryQuestionsConnection },
                  error,
                  loading,
                }) => {
                  if (error) return <Alert message="Error loading game!" />;
                  if (loading)
                    return (
                      <Main>
                        <p>Loading...</p>
                      </Main>
                    );
                  const isReady =
                    categoryQuestionsConnection.aggregate.count === 51;
                  if (isReady) {
                    return (
                      <GameScreen
                        game={game}
                        gameName={gameName}
                        isOwner={isOwner}
                        round={round}
                      />
                    );
                  }
                  return (
                    <Main>
                      <Alert
                        noBg
                        message="Sorry this game is not ready for play yet."
                      />
                    </Main>
                  );
                }}
              </Query>
            );
          }}
        </Query>
      )}
    </User>
  );
}

export default GameContainer;
