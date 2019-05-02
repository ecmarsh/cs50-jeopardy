import React, { Component, Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Query, Mutation } from 'react-apollo';
import Link from 'next/link';
import Main from './styles/Main';
import Button from './styles/Button';
import GameSummary, { GAME_SUMMARY_QUERY } from './GameSummary';
import EditTeams from './TeamNames';
import { SINGLE_GAME_QUERY } from './GameSetup';
import Error from './ErrorMessage';
import { Heading } from './Views';
import PaginationStyled from './styles/Paginated';
import { Divider, TextEmph } from './styles/Utilities';
import EditGameConfig from './GameConfig';
import gql from 'graphql-tag';

const UPDATE_PUBLIC_GAME_MUTATION = gql`
  mutation UPDATE_PUBLIC_GAME_MUTATION($gameName: String!, $isPublic: Boolean) {
    publishGame(game: $gameName, isPublic: $isPublic) {
      id
    }
  }
`;

class LaunchGame extends Component {
  static propTypes = {
    gameName: PropTypes.string.isRequired,
  };

  savePublicGame = async (e, publishGameMutation) => {
    e.preventDefault();
    const gameName = this.props.gameName;
    const message =
      'Are you sure you want to publish this game?\n\nYou and other users will still be allowed to play, but questions will be locked from editing.\n\nYou will have the option to unpublish this game.';
    if (confirm(message)) {
      try {
        const res = await publishGameMutation({
          variables: { gameName },
          refetchQueries: [
            { query: SINGLE_GAME_QUERY, variables: { name: gameName } },
          ],
        });
      } catch (error) {
        console.info(error);
      }
    }
  };

  render() {
    const { gameName } = this.props;
    return (
      <Query query={GAME_SUMMARY_QUERY} variables={{ gameName }}>
        {({ data, error }) => {
          if (error)
            return (
              <Main>
                <Error error={error} />
              </Main>
            );
          const isReady =
            data.categoryQuestionsConnection.aggregate.count === 51;
          return (
            <Main>
              <Heading
                game={gameName}
                title={`Prepare Game For Play`}
                nextLinkText={`Play`}
                nextLinkPath={`/play`}
                prevLinkPath={`/load`}
                prevLinkText={`Edit Questions`}
                hide={!isReady}
              />
              <Divider />
              <GameSummary data={data} />
              <Divider />
              <Query query={SINGLE_GAME_QUERY} variables={{ name: gameName }}>
                {({ data: { game }, loading, error }) => {
                  if (loading) return <p>Loading...</p>;
                  if (error) return <Error error={error} />;
                  return (
                    <Fragment>
                      {isReady ? (
                        <Fragment>
                          <div>
                            <TextEmph>Customize Team Names</TextEmph>
                            <EditTeams teams={game.teams} gameName={gameName} />
                          </div>
                          <Divider />
                          <div>
                            <TextEmph>Set Game Play Options</TextEmph>
                            <EditGameConfig
                              config={game.config}
                              gameName={gameName}
                            />
                          </div>
                          <Divider style={{ margin: '3rem auto' }} />
                          <PaginationStyled>
                            <Link
                              href={{
                                pathname: `/play`,
                                query: { game: gameName },
                              }}
                            >
                              <Button
                                primary
                                style={{
                                  fontSize: '1.6rem',
                                  margin: '0 0 2rem 0',
                                }}
                              >
                                Play Now ▷
                              </Button>
                            </Link>
                            {!game.isPublic && (
                              <Mutation mutation={UPDATE_PUBLIC_GAME_MUTATION}>
                                {(publishGame, { loading, error, called }) => {
                                  if (error) return <p>Error!</p>;
                                  return (
                                    <Button
                                      secondary
                                      style={{
                                        fontSize: '1.6rem',
                                        visibility: called
                                          ? 'hidden'
                                          : 'visible',
                                      }}
                                      onClick={e =>
                                        this.savePublicGame(e, publishGame)
                                      }
                                    >
                                      Publish{loading ? 'ing..' : ' Game'}
                                    </Button>
                                  );
                                }}
                              </Mutation>
                            )}
                          </PaginationStyled>
                        </Fragment>
                      ) : (
                        <PaginationStyled>
                          <p style={{ fontWeight: 'bolder' }}>
                            ⚠️ Finish{' '}
                            <Link
                              href={{
                                pathname: '/load',
                                query: { game: gameName },
                              }}
                            >
                              <a style={{ fontSize: '1em' }}>
                                loading game questions
                              </a>
                            </Link>{' '}
                            to be ready to play!
                          </p>
                        </PaginationStyled>
                      )}
                    </Fragment>
                  );
                }}
              </Query>
            </Main>
          );
        }}
      </Query>
    );
  }
}

export default LaunchGame;
export { UPDATE_PUBLIC_GAME_MUTATION };
