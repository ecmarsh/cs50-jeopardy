import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { TextMuted } from './styles/Utilities';
import PartialForm from './styles/Options';
import Error from './ErrorMessage';
import Button from './styles/Button';
import { SINGLE_GAME_QUERY } from './GameSetup';
import GameReset from './GameReset';

const UPDATE_GAME_CONFIG_MUTATION = gql`
  mutation UPDATE_GAME_CONFIG_MUTATION(
    $id: ID!
    $hasDoubleJeopardy: Boolean
    $hasRoundTimer: Boolean
    $roundTime: Int
    $finalTime: Int # $gameName: String!
  ) {
    updateGameConfig(
      id: $id
      hasDoubleJeopardy: $hasDoubleJeopardy
      hasRoundTimer: $hasRoundTimer
      roundTime: $roundTime
      finalTime: $finalTime
    ) {
      id
      hasDoubleJeopardy
      hasRoundTimer
      roundTime
      finalTime
    }
  }
`;

class GameConfig extends Component {
  state = {
    config: this.props.config,
    called: false,
  };

  toggleState = e => {
    // Toggle boolean config options
    const { name } = e.target;
    const config = { ...this.state.config };
    config[name] = !this.state.config[name];
    this.setState({ config });
  };

  setTime = e => {
    // Set round timers
    const { name, value } = e.target;
    const config = { ...this.state.config };
    config[name] = Number(value);
    this.setState({ config });
  };

  updateConfigCache = (cache, { data: { updateGameConfig } }) => {
    /**
     * Update the game config cache to match updated db config
     */
    const { gameName } = this.props;
    const query = {
      query: SINGLE_GAME_QUERY,
      variables: { name: gameName },
    };
    const { game } = cache.readQuery(query);
    game.config = updateGameConfig;
    cache.writeQuery({ ...query, data: { game } });
  };
  handleSubmit = async (e, mutationUpdateGameConfig, mutationResetGame) => {
    e.preventDefault();
    const { gameName } = this.props;
    const config = { ...this.state.config, gameName };
    // Dont pass typename as mutation variable
    delete config['__typename'];
    // Invoke update config mutation
    mutationUpdateGameConfig({
      variables: config,
      update: this.updateConfigCache,
    });
    // Reset the game too w/ any config changes
    await mutationResetGame();
    // UI confirmation update was saved
    this.toggleCalled();
    this.confirmSave(2000);
  };

  toggleCalled = () =>
    this.setState(prevState => ({ called: !prevState.called }));

  confirmSave = timeToShow => {
    // Flash the mutation message
    this.flashed = setTimeout(() => this.toggleCalled(), timeToShow);
  };

  componentWillUnmount = () => clearTimeout(this.flashed);

  render() {
    const {
      hasDoubleJeopardy,
      hasRoundTimer,
      roundTime,
      finalTime,
    } = this.state.config;
    return (
      <GameReset
        gameName={this.props.gameName}
        hasDoubleJeopardy={hasDoubleJeopardy}
      >
        {resetGame => (
          <Mutation mutation={UPDATE_GAME_CONFIG_MUTATION}>
            {(updateGameConfig, { loading, error }) => (
              <PartialForm
                onSubmit={e =>
                  this.handleSubmit(e, updateGameConfig, resetGame)
                }
              >
                <Error error={error} />
                <fieldset aria-disabled={loading} aria-busy={loading}>
                  <label htmlFor="hasDoubleJeopardy">
                    <input
                      checked={hasDoubleJeopardy}
                      name="hasDoubleJeopardy"
                      type="checkbox"
                      onChange={this.toggleState}
                    />
                    <TextMuted>Enable Daily Doubles</TextMuted>
                  </label>
                  <div className="roundTimer">
                    <label htmlFor="hasRoundTimer">
                      <input
                        checked={hasRoundTimer}
                        name="hasRoundTimer"
                        type="checkbox"
                        onChange={this.toggleState}
                      />
                      <TextMuted>Enable Round Timers</TextMuted>
                    </label>
                    {hasRoundTimer && (
                      <div className="roundTimer__options">
                        <label htmlFor="roundTime">
                          <TextMuted>Normal Round Time Limit</TextMuted>
                          <input
                            value={roundTime}
                            name="roundTime"
                            type="number"
                            step={1}
                            min={0}
                            onChange={this.setTime}
                          />
                          <TextMuted>minutes</TextMuted>
                        </label>
                        <br />
                        <label htmlFor="finalTime">
                          <TextMuted>Final Jeopardy Time Limit</TextMuted>
                          <input
                            value={finalTime}
                            name="finalTime"
                            type="number"
                            step={5}
                            min={0}
                            onChange={this.setTime}
                          />
                          <TextMuted>seconds</TextMuted>
                        </label>
                      </div>
                    )}
                  </div>
                  <div className="config__cta">
                    <p className="saved-confirmation">
                      <TextMuted hidden={!this.state.called}>
                        Game Configuration Saved!
                      </TextMuted>
                    </p>
                    <Button tertiary type="submit">
                      {loading ? 'Saving...' : 'Save Game Configuration'}
                    </Button>
                    <p style={{ marginTop: '1rem', opacity: '.7' }}>
                      <TextMuted smaller italic>
                        NOTE: This will also reset your game.
                      </TextMuted>
                    </p>
                  </div>
                </fieldset>
              </PartialForm>
            )}
          </Mutation>
        )}
      </GameReset>
    );
  }
}

export default GameConfig;
export { UPDATE_GAME_CONFIG_MUTATION };
