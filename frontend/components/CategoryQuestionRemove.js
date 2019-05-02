import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Button from './styles/Button';
import Error from './ErrorMessage';
import { CATEGORY_QUESTIONS_QUERY } from './CategoryQuestions';
import { GAME_QUESTIONS_QUERY } from './QuestionsList';
import { GAME_SUMMARY_QUERY } from './GameSummary';
import { TextLarger } from './styles/Utilities';
import * as R from 'ramda';

const REMOVE_FROM_CATEGORY_MUTATION = gql`
  mutation REMOVE_FROM_CATEGORY_MUTATION($id: ID!) {
    removeFromCategory(id: $id) {
      id
    }
  }
`;

class RemoveFromCategory extends Component {
  static propTypes = {
    children: PropTypes.string,
    categoryQuestionId: PropTypes.string.isRequired,
  };
  static defaultProps = {
    children: `✕`,
  };

  handleClick = async (e, removeFromCategoryMutation) => {
    e.preventDefault();
    const {
      questionId,
      categoryQuestionId,
      categoryId,
      difficulty,
      gameName,
    } = this.props;

    const res = await removeFromCategoryMutation({
      // Mutation variables
      variables: {
        id: categoryQuestionId,
      },
      // Update local data
      update: (cache, { data: { removeFromCategory } }) => {
        // Update the question so it knows it's not in a category
        const { questions } = cache.readQuery({
          query: GAME_QUESTIONS_QUERY,
          variables: { gameName },
        });
        const questionIndex = questions.findIndex(
          question => question.id === questionId
        );

        const idx = R.findIndex(R.propEq('id', questionId));

        // Filter the category question out
        questions[questionIndex].categoryQuestions = questions[
          questionIndex
        ].categoryQuestions.filter(
          categoryQuestion => categoryQuestion.id !== removeFromCategory.id
        );

        // Write back the questions data
        cache.writeQuery({
          query: GAME_QUESTIONS_QUERY,
          variables: { gameName },
          data: { questions },
        });
        // Read, update, writeback the loaded questions cache
        const { categoryQuestions } = cache.readQuery({
          query: CATEGORY_QUESTIONS_QUERY,
          variables: { categoryId },
        });
        // Remove the question from the category
        categoryQuestions[difficulty - 1].question = null;
        // Write back the cache
        cache.writeQuery({
          query: CATEGORY_QUESTIONS_QUERY,
          variables: { categoryId },
          data: { categoryQuestions },
        });
      },
      optimisticResponse: {
        __typename: 'Mutation',
        removeFromCategory: {
          id: categoryQuestionId,
          __typename: 'CategoryQuestion',
        },
      },
    });
  };

  render() {
    const { gameName } = this.props;
    return (
      <Mutation
        mutation={REMOVE_FROM_CATEGORY_MUTATION}
        refetchQueries={[
          {
            query: GAME_SUMMARY_QUERY,
            variables: { gameName },
          },
        ]}
      >
        {(removeFromCategory, { loading, error }) => {
          if (loading) return <p>Removing..</p>;
          if (error) return <Error error={error} />;
          return (
            <Button
              close
              onClick={e => this.handleClick(e, removeFromCategory)}
            >
              <TextLarger>{this.props.children}</TextLarger>
            </Button>
          );
        }}
      </Mutation>
    );
  }
}

export default RemoveFromCategory;
export { REMOVE_FROM_CATEGORY_MUTATION };
