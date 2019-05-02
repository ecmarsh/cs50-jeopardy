import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { SINGLE_GAME_QUERY } from './GameSetup';
import { CATEGORY_QUESTIONS_QUERY } from './CategoryQuestions';
import * as R from 'ramda';

const GAME_RESET_MUTATION = gql`
  mutation GAME_RESET_MUTATION(
    $gameName: String!
    $hasDoubleJeopardy: Boolean
  ) {
    resetGame(name: $gameName) {
      id
      teams {
        id
        name
        score
      }
      categories {
        id
        categoryQuestions {
          id
          answered
        }
      }
    }
    updateDoubleJeopardy(
      gameName: $gameName
      hasDoubleJeopardy: $hasDoubleJeopardy
    ) {
      id
    }
    resetBoard @client
  }
`;

const GameReset = ({ children, gameName, hasDoubleJeopardy }) => (
  <Mutation
    mutation={GAME_RESET_MUTATION}
    variables={{ gameName, hasDoubleJeopardy }}
    update={(cache, { data: { resetGame, updateDoubleJeopardy } }) => {
      const gameQuery = {
        query: SINGLE_GAME_QUERY,
        variables: { name: gameName },
      };

      // Read team scores
      const { game } = cache.readQuery(gameQuery);
      // Set each team back to zero
      game.teams = resetGame.teams;
      // Write back cache
      cache.writeQuery({ ...gameQuery, data: { game: game } });

      // Reset each question to unanswered
      const resetQuestion = categoryId => {
        const categoriesQuery = {
          query: CATEGORY_QUESTIONS_QUERY,
          variables: { categoryId },
        };

        let categoryQuestions;
        // If the round hasn't been loaded yet, ignore it
        try {
          const data = cache.readQuery(categoriesQuery);
          categoryQuestions = data.categoryQuestions;
        } catch (err) {
          return;
        }

        // Else set each question to unanswered
        for (let question of categoryQuestions) {
          if (question.answered || question.isDouble) {
            question.answered = false;
            question.isDouble = false;
          }

          // Update double jeopardy question
          const isInDoubleJeopardyPayload =
            R.findIndex(R.propEq('id', question.id))(updateDoubleJeopardy) !==
            -1;
          if (isInDoubleJeopardyPayload) {
            // Set question to 2x
            question.isDouble = true;
          }
        }
        // Lastly write back the data
        cache.writeQuery({ ...categoriesQuery, data: { categoryQuestions } });
        return;
      };

      // Invoke question resets
      R.forEach(resetQuestion, R.pluck('id', game.categories));

      console.info('Game was reset');
    }}
  >
    {resetGame => children(resetGame)}
  </Mutation>
);

GameReset.propTypes = {
  gameName: PropTypes.string.isRequired,
};

export default GameReset;
export { GAME_RESET_MUTATION };
