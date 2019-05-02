import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import GamesList from './GamesList';
import { GAME_QUESTIONS_QUERY } from './QuestionsList';
import { GAME_SUMMARY_QUERY } from './GameSummary';
import Error from './ErrorMessage';
import Form from './styles/Form';
import FullScreen from './styles/FullScreen';
import Button from './styles/Button';
import { TextMuted } from './styles/Utilities';

const CREATE_QUESTION_MUTATION = gql`
  mutation CREATE_QUESTION_MUTATION(
    $question: String!
    $answer: String!
    $gameName: String!
  ) {
    createQuestion(question: $question, answer: $answer, gameName: $gameName) {
      id
      user {
        id
        name
      }
      createdAt
      question
      answer
      game {
        id
        name
      }
      categoryQuestions {
        id
      }
    }
  }
`;

class CreateQuestion extends Component {
  state = {
    question: '',
    answer: '',
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  componentDidMount = () => {
    if (this.props.gameName) {
      this.setState({ [`gameName`]: this.props.gameName });
    }
  };

  update = (cache, payload) => {
    /* Manually update cache on client to match server */
    const { gameName } = this.props;
    if (gameName) {
      // Read cache for game we want
      const data = cache.readQuery({
        query: GAME_QUESTIONS_QUERY,
        variables: { gameName },
      });
      // Add created question to local data
      const {
        answer,
        createdAt,
        id,
        question,
        user,
        categoryQuestions,
      } = payload.data.createQuestion;
      data.questions.unshift({
        answer,
        createdAt,
        id,
        question,
        user,
        categoryQuestions,
        __typename: 'Question',
      });
      // Rewrite cache
      cache.writeQuery({
        query: GAME_QUESTIONS_QUERY,
        variables: { gameName },
        data,
      });
    }
    return;
  };

  render() {
    const { question, answer } = this.state;
    const { gameName, round } = this.props;
    return (
      <FullScreen>
        <Mutation
          mutation={CREATE_QUESTION_MUTATION}
          variables={this.state}
          update={this.update}
          refetchQueries={[
            {
              query: GAME_SUMMARY_QUERY,
              variables: { gameName: gameName || this.state.gameName },
            },
          ]}
        >
          {(createQuestion, { loading, error }) => (
            <Form
              data-test="create-question-form"
              onSubmit={async e => {
                // stop form from submitting
                e.preventDefault();
                // invoke mutation
                const res = await createQuestion();
                // Dynamically redirect to thank you or back to admin board
                const pathname = gameName ? `/load` : `/thank-you`;
                const query = gameName
                  ? { game: gameName, round }
                  : { id: res.data.createQuestion.id };
                Router.push({ pathname, query });
              }}
            >
              <Error error={error} />
              <h2>Submit Question</h2>
              <fieldset disabled={loading} aria-busy={loading}>
                {!gameName && (
                  <label htmlFor="gameName">
                    <TextMuted>Game</TextMuted>
                    <GamesList
                      htmlName="gameName"
                      handler={this.handleChange}
                    />
                  </label>
                )}
                <label htmlFor="question">
                  <textarea
                    name="question"
                    id="question"
                    placeholder="Enter question here"
                    required
                    value={question}
                    onChange={this.handleChange}
                    maxLength="200"
                    rows={4}
                    autoComplete="off"
                    autoFocus
                    className={question.length === 0 ? 'isBlank' : ''}
                  />
                  <TextMuted>Question</TextMuted>
                </label>
                <label htmlFor="answer">
                  <input
                    type="text"
                    name="answer"
                    id="answer"
                    placeholder="Answer"
                    maxLength="50"
                    required
                    value={answer}
                    onChange={this.handleChange}
                    autoComplete="off"
                  />
                  <TextMuted>Answer</TextMuted>
                </label>
                <Button primary type="submit">
                  Submit Question
                </Button>
              </fieldset>
            </Form>
          )}
        </Mutation>
      </FullScreen>
    );
  }
}

export default CreateQuestion;
export { CREATE_QUESTION_MUTATION };
