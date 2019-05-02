import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { SINGLE_GAME_QUERY } from './GameSetup';
import QuestionsList from './QuestionsList';
import GameLocked from './GameLocked';
import CategoriesLoad from './CategoriesLoad';
import Error from './ErrorMessage';
import Columns from './styles/Columns';
import Main from './styles/Main';

function GameLoad({ game, round }) {
  const headingProps = {
    title: `Choose Questions`,
    nextLinkPath: `/launch`,
    nextLinkText: `Launch`,
    prevLinkPath: `/setup`,
    prevLinkText: `Back to Setup`,
  };

  return (
    <Query query={SINGLE_GAME_QUERY} variables={{ name: game }}>
      {({ data, loading, error }) => {
        if (loading) return <Main>Loading...</Main>;
        if (!data || error)
          return (
            <Main>
              <Error error={error} />
            </Main>
          );
        if (data.game.isPublic === true)
          return <GameLocked game={game} headingProps={headingProps} />;
        return (
          <Columns>
            <QuestionsList game={game} round={round} />
            <CategoriesLoad
              game={game}
              round={round}
              headingProps={headingProps}
            />
          </Columns>
        );
      }}
    </Query>
  );
}
GameLoad.propTypes = {
  game: PropTypes.string.isRequired,
  round: PropTypes.number.isRequired,
};

export default GameLoad;
