import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import TeamScores from './ScoreTeams';
import Board from './GameBoard';
import Error from './ErrorMessage';
import formatRound from '../lib/formatRound';
import { SINGLE_GAME_QUERY } from './GameSetup';
import RoundTimer from './Timer';
import ActionBar from './GameControls';
import SoundBar from './GameSounds';
import { LOCAL_STATE_QUERY } from './SoundEffect';
import UserScore from './ScoreUser';
import TitleBar from './styles/TitleBar';

export const ANSWERED_QUESTIONS_QUERY = gql`
  query {
    answeredQuestions @client {
      id
      val
    }
  }
`;

const Scoreboard = ({ isOwner, ...rest }) =>
  isOwner ? <TeamScores {...rest} /> : <UserScore />;

class GameScreen extends Component {
  static propTypes = {
    gameName: PropTypes.string.isRequired,
    round: PropTypes.number.isRequired,
    isOwner: PropTypes.bool,
  };

  state = {
    teamId: null,
  };

  toggleChosenTeam = teamId => {
    this.setState(prevState => ({
      teamId,
      ['prevTeam']: prevState.teamId,
    }));
  };

  render() {
    const { gameName, round, isOwner } = this.props;
    return (
      <Query query={SINGLE_GAME_QUERY} variables={{ name: gameName }}>
        {({ data: { game }, loading, error }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <Error error={error} />;
          return (
            <>
              <DarkBG />
              <OverlayDiv data-test="game-view">
                <TitleBar>
                  <div className="inner">
                    <div className="title">
                      <h1>{gameName}</h1>
                      <h2>{formatRound(round)}</h2>
                    </div>
                    <Scoreboard
                      isOwner={isOwner}
                      teams={game.teams}
                      chosen={this.state.teamId}
                      prevChosen={this.state.prevTeam}
                    />
                  </div>
                </TitleBar>

                <Query query={LOCAL_STATE_QUERY}>
                  {({ data: { soundOn } }) => {
                    return (
                      <Board
                        gameName={gameName}
                        categories={game.categories}
                        config={game.config}
                        round={round}
                        teams={game.teams}
                        prevChosenTeam={this.state.prevTeam}
                        toggleChosenTeam={this.toggleChosenTeam}
                        soundOn={soundOn}
                        isOwner={isOwner}
                      />
                    );
                  }}
                </Query>
                <ActionBar
                  gameName={gameName}
                  round={round}
                  config={game.config}
                  isOwner={isOwner}
                />
                {isOwner && game.config.hasRoundTimer && round < 3 && (
                  <RoundTimer
                    key={`timer${round}`}
                    gameName={gameName}
                    round={round}
                    roundTime={game.config.roundTime}
                    finalTime={game.config.finalTime}
                  />
                )}
                <SoundBar />
              </OverlayDiv>
            </>
          );
        }}
      </Query>
    );
  }
}

const DarkBG = styled.div`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  margin: 0 auto;
  width: 100vw;
  max-width: 144rem;
  min-height: 100vh;
  background: ${props => props.theme.black};
`;

const OverlayDiv = styled.div`
  position: fixed;
  top: 9.5rem;
  width: calc(100vw - 3rem);
  padding: 0 5px;
  margin: 0 auto;
  height: calc(100vh - 17rem);
  max-width: 141rem;
  background: ${props => props.theme.black};
`;

export default GameScreen;
