import React from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Button from './styles/Button';
import { ANSWERED_QUESTIONS_QUERY } from './GameScreen';
import * as R from 'ramda';
import Router from 'next/router';
import { PLAYED_GAMES_QUERY } from './StudyGames';

const SAVE_PLAYED_GAME_MUTATION = gql`
  mutation SAVE_PLAYED_GAME_MUTATION(
    $answeredQuestions: [CategoryQuestionWhereUniqueInput!]!
    $score: Int!
    $gameName: String!
  ) {
    createStudyGame(
      answeredQuestions: $answeredQuestions
      score: $score
      game: $gameName
    ) {
      id
    }
  }
`;

function FinishGameButton({ gameName, children }) {
  const handleClick = async (e, saveGame, data) => {
    e.preventDefault();
    const answeredQuestions = [];
    data.answeredQuestions.forEach(q => {
      if (q.val < 0) {
        // Only save the missed questions for reviewing
        answeredQuestions.push({ id: q.id });
      }
    });
    const score = R.pluck('val', data.answeredQuestions).reduce((a, b) => {
      return a + b;
    }, 0);
    const variables = { answeredQuestions, score, gameName };
    const res = await saveGame({
      variables,
      refetchQueries: [{ query: PLAYED_GAMES_QUERY }],
      update: (cache, { data: { createStudyGame } }) => {
        const data = cache.readQuery({ query: ANSWERED_QUESTIONS_QUERY });
        data.answeredQuestions = data.answeredQuestions.filter(
          q => q.val === 0
        );
        cache.writeData({ query: ANSWERED_QUESTIONS_QUERY, data });
        // Route to review screen
        Router.push({
          pathname: `/review`,
          query: { game: createStudyGame.id },
        });
      },
    });
  };

  return (
    <Mutation mutation={SAVE_PLAYED_GAME_MUTATION}>
      {(mutate, res) => {
        if (res.error) return <span style={{ color: 'red' }}>Save Error</span>;
        return (
          <Query query={ANSWERED_QUESTIONS_QUERY}>
            {({ data, error }) => {
              if (error) data = [];
              return (
                <Button tertiary onClick={e => handleClick(e, mutate, data)}>
                  {children}
                </Button>
              );
            }}
          </Query>
        );
      }}
    </Mutation>
  );
}

export default FinishGameButton;
export { SAVE_PLAYED_GAME_MUTATION };
