import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Button from './styles/Button';
import { GAME_QUESTIONS_QUERY } from './QuestionsList';
import { CATEGORY_QUESTIONS_QUERY } from './CategoryQuestions';
import { GAME_SUMMARY_QUERY } from './GameSummary';

const DELETE_QUESTION_MUTATION = gql`
  mutation DELETE_QUESTION_MUTATION($id: ID!) {
    deleteQuestion(id: $id) {
      id
      categoryQuestions {
        id
        category {
          id
        }
      }
    }
  }
`;

class DeleteQuestion extends Component {
  static propTypes = {
    gameName: PropTypes.string.isRequired,
    questionId: PropTypes.string.isRequired,
  };
  static defaultProps = {
    children: `❌`,
  };

  update = (cache, payload) => {
    /* Manually update cache on client to match server */
    const { gameName, categoryQuestionsProp } = this.props;
    // Read cache for question we want
    const data = cache.readQuery({
      query: GAME_QUESTIONS_QUERY,
      variables: { gameName },
    });
    // Filter deleted question out of page
    data.questions = data.questions.filter(
      question => question.id !== payload.data.deleteQuestion.id
    );
    //Rewrite cache
    cache.writeQuery({
      query: GAME_QUESTIONS_QUERY,
      variables: { gameName },
      data: {
        questions: [...data.questions],
      },
    });

    /* Update UI to remove deleted question from the gameboard */
    function resetQuestion(categoryId) {
      try {
        const { categoryQuestions } = cache.readQuery({
          query: CATEGORY_QUESTIONS_QUERY,
          variables: { categoryId },
        });
        // Find and remove the category question
        const categoryQuestionIndex = categoryQuestions.findIndex(
          catQuestion => catQuestion.category.id === categoryId
        );
        categoryQuestions[categoryQuestionIndex].question = null;
        // Write back the cache
        cache.writeQuery({
          query: CATEGORY_QUESTIONS_QUERY,
          variables: { categoryId },
          data: { categoryQuestions },
        });
      } catch (err) {
        return; // Do nothing
      }
    }
    // Invoke question resets
    categoryQuestionsProp.forEach(categoryQuestion =>
      resetQuestion(categoryQuestion.category.id)
    );
  };

  render() {
    const { questionId, gameName, children } = this.props;
    return (
      <Mutation
        mutation={DELETE_QUESTION_MUTATION}
        variables={{ id: questionId }}
        update={this.update}
        refetchQueries={[
          { query: GAME_SUMMARY_QUERY, variables: { gameName } },
        ]}
      >
        {(deleteQuestion, { error }) => (
          <Button
            close
            onClick={async e => {
              e.preventDefault();
              const message = `Permanently delete this question?\n\nIt will also be removed from any categories.`;
              if (confirm(message)) {
                const res = await deleteQuestion();
              }
            }}
          >
            {children}
          </Button>
        )}
      </Mutation>
    );
  }
}

export default DeleteQuestion;
export { DELETE_QUESTION_MUTATION };
