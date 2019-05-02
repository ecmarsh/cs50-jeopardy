import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Router from 'next/router';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import GameReset from './GameReset';
import Button from './styles/Button';
import { ThemeToggler } from './Theme';
import SaveGameButton from './StudyGameCreate';
import { Slide } from './Animated';

const LOCAL_RESET_MUTATION = gql`
  mutation {
    resetBoard @client
  }
`;

function ActionBar({ gameName, round, config, isOwner }) {
  const [hovered, toggle] = useState(false);

  return (
    <Slide
      className="left"
      onMouseEnter={() => toggle(true)}
      onMouseLeave={() => toggle(false)}
      hovered={hovered}
    >
      <div className="inner" data-test="game-control-bar">
        {isOwner && (
          <>
            <Link
              href={{
                pathname: 'launch',
                query: { game: gameName },
              }}
            >
              <a> ◁ Back to Edit Game</a>
            </Link>

            <GameReset
              gameName={gameName}
              hasDoubleJeopardy={config.hasDoubleJeopardy}
            >
              {resetGameMutation => (
                <Button
                  tertiary
                  onClick={async e => {
                    if (confirm('Are you sure you want to reset your game?')) {
                      e.preventDefault();
                      await resetGameMutation();
                      Router.push({
                        pathname: `/play`,
                        query: { game: gameName },
                      });
                    }
                  }}
                >
                  Reset Game
                </Button>
              )}
            </GameReset>
          </>
        )}
        {!isOwner && (
          <>
            <Mutation mutation={LOCAL_RESET_MUTATION}>
              {resetBoard => (
                <Button
                  tertiary
                  onClick={e => {
                    e.preventDefault();
                    if (confirm('Are you sure you want to reset this game?')) {
                      resetBoard();
                      // route back to first round
                      Router.push({
                        pathname: `/play`,
                        query: { game: gameName },
                      });
                    }
                  }}
                >
                  Reset Game
                </Button>
              )}
            </Mutation>
          </>
        )}
        <ThemeToggler buttonTxt={`Toggle Theme`} />
        {round <= (isOwner ? 2 : 1) && (
          <Link
            href={{
              pathname: 'play',
              query: { game: gameName, round: round + 1 },
            }}
          >
            <a> Next Round ▷</a>
          </Link>
        )}
        {!isOwner && (
          <SaveGameButton gameName={gameName}>Finish Game ✓</SaveGameButton>
        )}
      </div>
      <div className={'bar-icon'}>
        <img src="../static/settings-icon.png" alt="game-control-icon" />
      </div>
    </Slide>
  );
}

ActionBar.propTypes = {
  gameName: PropTypes.string.isRequired,
  round: PropTypes.number.isRequired,
  config: PropTypes.object.isRequired,
  isOwner: PropTypes.bool.isRequired,
};

ActionBar.defaultProps = {
  round: 1,
  isOwner: false,
};

export default ActionBar;
