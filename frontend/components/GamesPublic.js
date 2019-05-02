import React, { useState } from 'react';
import { Query } from 'react-apollo';
import Router from 'next/router';
import Error from './ErrorMessage';
import { GAMES_QUERY } from './GamesList';
import Form from './styles/Form';
import Button from './styles/Button';
import { TextEmph, TextMuted } from './styles/Utilities';
import { Alert } from './Views';
import Main from './styles/Main';
import Link from 'next/link';

function PublicGames(props) {
  const [selectedGame, setSelectedGame] = useState('Select Game');
  const handleSubmit = e => {
    e.preventDefault();
    if (!selectedGame || selectedGame === 'Select Game') {
      alert('Please choose a game to play!');
      return;
    }
    Router.push({
      pathname: `/play`,
      query: { game: selectedGame },
    });
  };
  return (
    <Query query={GAMES_QUERY}>
      {({ data, loading, error }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <Error error={error} />;
        const publicGames = data.games.filter(game => game.isPublic === true);
        if (!publicGames.length) {
          return (
            <Main>
              <Alert message="Sorry no published games yet!" noBg>
                <Link href="/start">
                  <Button primary>Create A Game</Button>
                </Link>
              </Alert>
            </Main>
          );
        }
        return (
          <Form onSubmit={e => handleSubmit(e)} data-test="public-games-form">
            <TextEmph>Start A Study Game</TextEmph>
            <fieldset>
              <label htmlFor="public-games">
                <TextMuted>Available Games</TextMuted>
                <select
                  name="public-games"
                  id="public-games"
                  autoFocus
                  required
                  onChange={e => setSelectedGame(e.target.value)}
                  value={selectedGame}
                  style={{ textTransform: 'capitalize' }}
                >
                  <option disabled>Select Game</option>
                  {publicGames.map(game => (
                    <option key={game.id} value={game.name}>
                      {game.name}
                    </option>
                  ))}
                </select>
              </label>
              <Button primary type="submit">
                Play Now ▷
              </Button>
            </fieldset>
          </Form>
        );
      }}
    </Query>
  );
}

export default PublicGames;
