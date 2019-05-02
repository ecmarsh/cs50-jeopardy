import React from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import Main from './styles/Main';
import formatScore from '../lib/formatScore';
import { TextEmph, TextMuted, Divider } from './styles/Utilities';
import { format } from 'date-fns';
import Link from 'next/link';
import Button from './styles/Button';
import { Tree } from './Animated';
import Frame from './styles/Frame';
import { CloseSquareO } from './styles/icons';

const PLAYED_GAMES_QUERY = gql`
  query PLAYED_GAMES_QUERY {
    studyGames(orderBy: createdAt_DESC) {
      id
      createdAt
      score
      game {
        id
        name
      }
      answeredQuestions {
        id
        question {
          id
          question
          answer
        }
      }
    }
  }
`;
const DELETE_STUDY_GAME_MUTATION = gql`
  mutation DELETE_STUDY_GAME_MUTATION($id: ID!) {
    deleteStudyGame(id: $id) {
      id
    }
  }
`;

const iconStyles = {
  width: '.9em',
  height: '.9em',
  marginRight: '.5em',
  cursor: 'pointer',
  verticalAlign: 'middle',
  fill: 'currentColor',
};

const DeleteStudyGame = ({ id }) => (
  <Mutation
    mutation={DELETE_STUDY_GAME_MUTATION}
    refetchQueries={[{ query: PLAYED_GAMES_QUERY }]}
    update={(cache, { data: { deleteStudyGame } }) => {
      const query = { query: PLAYED_GAMES_QUERY };
      const data = cache.readQuery(query);
      data.studyGames = data.studyGames.filter(
        sGame => sGame.id !== deleteStudyGame.id
      );
      cache.writeQuery({ ...query, data });
    }}
  >
    {(mutate, res) => (
      <Button
        tertiary
        onClick={async () => await mutate({ variables: { id } })}
        style={{ marginBottom: '1rem' }}
      >
        <CloseSquareO style={iconStyles} />
        Remove Game
      </Button>
    )}
  </Mutation>
);

function ReviewStudyGames({ game }) {
  return (
    <Query query={PLAYED_GAMES_QUERY}>
      {({ data: { studyGames }, loading, error }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <Error error={error} />;
        if (game) {
          // Only show one game if querying for specific game
          studyGames = studyGames.filter(sg => sg.id === game);
        }
        return (
          <Main style={{ paddingTop: '2rem' }}>
            <TextEmph>Review Missed Questions</TextEmph>

            <Divider />
            {!studyGames.length && (
              <div>
                <p>
                  <Link href="/study">
                    <a>Play a game</a>
                  </Link>{' '}
                  first to have some review questions!
                </p>
              </div>
            )}
            {studyGames.map(_game => (
              <Frame key={_game.id} style={{ padding: `0 15%` }} id={_game.id}>
                <h3 style={{ textTransform: 'uppercase' }}>
                  <TextMuted>Game:</TextMuted> {_game.game.name}
                </h3>
                <h3>
                  <TextMuted>Score:</TextMuted> {formatScore(_game.score)}
                </h3>
                <p>
                  <TextMuted>
                    Played: {format(_game.createdAt, 'MM-DD-YY h:mm a')}
                  </TextMuted>
                </p>
                <DeleteStudyGame id={_game.id} />
                {!!_game.answeredQuestions.length && (
                  <Tree
                    name="Missed Questions"
                    open={Boolean(game)}
                    style={{ fontWeight: '700' }}
                  >
                    {_game.answeredQuestions.map((q, i) => (
                      <Tree
                        key={`s_${q.id}_${i}`}
                        name={`Q: ${q.question.question}`}
                      >
                        <Tree
                          key={`s_${q.id}_${i}`}
                          name={`${q.question.answer}`}
                        />
                      </Tree>
                    ))}
                  </Tree>
                )}
                <Divider style={{ margin: '1rem 0' }} />
                {game && (
                  <p>
                    <Link href="/review">
                      <a>View My Game History</a>
                    </Link>
                  </p>
                )}
              </Frame>
            ))}
          </Main>
        );
      }}
    </Query>
  );
}

export default ReviewStudyGames;
export { PLAYED_GAMES_QUERY };
