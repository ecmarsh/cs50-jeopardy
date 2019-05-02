import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import DropTarget from './styles/DropTarget';
import Error from './ErrorMessage';
import RemoveFromCategory from './CategoryQuestionRemove';
import { GAME_QUESTIONS_QUERY } from './QuestionsList';
import { CATEGORY_QUESTIONS_QUERY } from './CategoryQuestions';
import { GAME_SUMMARY_QUERY } from './GameSummary';
import * as R from 'ramda';

const ADD_TO_CATEGORY_MUTATION = gql`
  mutation ADD_TO_CATEGORY_MUTATION($id: ID!, $questionId: ID!) {
    updateCategoryQuestion(id: $id, questionId: $questionId) {
      id
      question {
        categoryQuestions {
          id
        }
      }
    }
  }
`;

class AddToCategory extends Component {
  static propTypes = {
    loaded: PropTypes.bool,
    question: PropTypes.object,
    categoryQuestionId: PropTypes.string.isRequired,
    categoryId: PropTypes.string.isRequired,
    difficulty: PropTypes.number.isRequired,
    categoryName: PropTypes.string.isRequired,
    gameName: PropTypes.string.isRequired,
  };

  state = {
    questionId: String(),
    question: String(),
  };

  componentDidMount = () => {
    if (this.props.question) {
      const { id, question } = this.props.question;
      this.setState({
        questionId: id,
        question,
      });
    }
  };

  handleDragOver = e => {
    e.preventDefault();
    e.persist(); // don't pool the events
    e.target.style.transform = 'scale(1.2)';
    e.dataTransfer.dropEffect = 'move';
  };

  handleDragLeave = e => {
    e.target.style.transform = 'scale(1)';
  };

  handleDrop = async (e, categoryMutation) => {
    e.persist();
    e.target.style.transform = 'scale(1)';
    e.dataTransfer.dropEffect = 'move';

    const { categoryId, categoryQuestionId, difficulty, gameName } = this.props,
      questionId = e.dataTransfer.getData('id'),
      question = e.dataTransfer.getData('question'),
      answer = e.dataTransfer.getData('answer');

    this.setState({ questionId, question });

    const res = await categoryMutation({
      variables: { id: categoryQuestionId, questionId },
      update: (cache, { data: { updateCategoryQuestion } }) => {
        /* Update category question with added question */
        const categoryQuestionsQuery = {
          query: CATEGORY_QUESTIONS_QUERY,
          variables: { categoryId },
        };
        // Read the data
        const { categoryQuestions } = cache.readQuery(categoryQuestionsQuery);
        // Add the question
        categoryQuestions[difficulty - 1].question = {
          answer,
          id: questionId,
          question,
          __typename: 'Question',
        };
        // Write back the cache
        cache.writeQuery({
          data: { categoryQuestions },
          ...categoryQuestionsQuery,
        });

        /* Update question to know it's in a category now */
        const gameQuestionsQuery = {
          query: GAME_QUESTIONS_QUERY,
          variables: { gameName },
        };
        // Read data to questions variable
        const { questions } = cache.readQuery(gameQuestionsQuery);
        // Add new question into matching question's category list
        const idx = R.findIndex(R.propEq('id', questionId), questions);
        const questionToAdd = {
          id: updateCategoryQuestion.id,
          __typename: 'CategoryQuestion',
          category: {
            id: categoryId,
            __typename: 'Category',
          },
        };
        questions[idx].categoryQuestions.push(questionToAdd);
        // Write back cache with updates
        gameQuestionsQuery.data = { questions };
        //console.log(gameQuestionsQuery);
        cache.writeQuery(gameQuestionsQuery);
      },
    });
  };

  render() {
    const {
      loaded,
      question,
      categoryQuestionId,
      categoryId,
      difficulty,
      categoryName,
      gameName,
    } = this.props;

    return (
      <Mutation
        mutation={ADD_TO_CATEGORY_MUTATION}
        refetchQueries={[
          {
            query: GAME_SUMMARY_QUERY,
            variables: { gameName },
          },
        ]}
      >
        {(updateCategoryQuestion, { loading, error }) => {
          if (loading) return <DropTarget>Adding..</DropTarget>;
          if (error) return <Error error={error} />;
          return (
            <DropTarget
              id={`${categoryName}-${categoryId}`}
              onDragOver={!loaded ? this.handleDragOver : undefined}
              onDragLeave={!loaded ? this.handleDragLeave : undefined}
              onDrop={e => this.handleDrop(e, updateCategoryQuestion)}
              className={loaded ? '--isLoaded' : '--isNotLoaded'}
            >
              {loaded ? <div>{question.question}</div> : difficulty}
              {loaded && (
                <RemoveFromCategory
                  categoryQuestionId={categoryQuestionId}
                  categoryId={categoryId}
                  gameName={gameName}
                  difficulty={difficulty}
                  questionId={this.state.questionId}
                />
              )}
            </DropTarget>
          );
        }}
      </Mutation>
    );
  }
}

export default AddToCategory;
export { ADD_TO_CATEGORY_MUTATION };
