import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Error from './ErrorMessage';
import Form from './styles/Form';
import { USER_GAMES_QUERY } from './GamesUser';
import FullScreen from './styles/FullScreen';
import Button from './styles/Button';
import { TextMuted } from './styles/Utilities';

const CREATE_GAME_MUTATION = gql`
  mutation CREATE_GAME_MUTATION($gameName: String!) {
    createGame(name: $gameName) {
      id
      name
      createdAt
    }
  }
`;

class CreateGame extends Component {
  state = {
    gameName: '',
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    const { gameName } = this.state;
    return (
      <FullScreen>
        <Mutation mutation={CREATE_GAME_MUTATION}>
          {(createGame, { loading, called, error }) => (
            <Form
              data-test="create-game-form"
              onSubmit={async e => {
                // stop form from submitting
                e.preventDefault();
                // invoke mutation
                const res = await createGame({
                  variables: this.state,
                  refetchQueries: [{ query: USER_GAMES_QUERY }],
                });
                // proceed to next in game setup
                Router.push({
                  pathname: '/setup',
                  query: { game: gameName },
                });
              }}
            >
              <Error error={error} />
              <h2>Create New Game</h2>
              <fieldset disabled={loading} aria-busy={loading || called}>
                <label htmlFor="gameName">
                  <input
                    type="text"
                    name="gameName"
                    id="gameName"
                    placeholder="Game Name"
                    required
                    value={gameName}
                    onChange={this.handleChange}
                    autoComplete="off"
                  />
                  <TextMuted>Game Name</TextMuted>
                </label>
                <Button primary type="submit">
                  Create Game
                </Button>
                <TextMuted smaller style={{ marginTop: '2.5rem' }}>
                  Please note it may take a minute to setup your new game.
                </TextMuted>
              </fieldset>
            </Form>
          )}
        </Mutation>
      </FullScreen>
    );
  }
}

export default CreateGame;
export { CREATE_GAME_MUTATION };
