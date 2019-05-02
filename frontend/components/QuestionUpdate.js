import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import Form from './styles/Form';
import Button from './styles/Button';
import { SINGLE_QUESTION_QUERY } from './QuestionConfirm';
import Router from 'next/router';
import { TextMuted } from './styles/Utilities';

const UPDATE_QUESTION_MUTATION = gql`
  mutation UPDATE_QUSTION_MUTATION(
    $id: ID!
    $question: String
    $answer: String
  ) {
    updateQuestion(id: $id, question: $question, answer: $answer) {
      id
      question
      answer
    }
  }
`;

class UpdateQuestion extends Component {
  state = {};

  handleChange = e => {
    const { name, type, value } = e.target;
    this.setState({ [name]: value });
  };

  updateQuestion = async (e, updateQuestionMutation) => {
    e.preventDefault();
    const res = await updateQuestionMutation({
      variables: {
        id: this.props.id,
        ...this.state,
      },
    });
    Router.push({
      pathname: '/thank-you',
      query: { id: this.props.id, updated: true },
    });
  };

  render() {
    const { id } = this.props;
    return (
      <Query query={SINGLE_QUESTION_QUERY} variables={{ id }}>
        {({ data, loading }) => {
          if (loading) return <p>Loading...</p>;
          if (!data.question) return <p>No Question Found for ID {id}</p>;
          return (
            <Mutation
              mutation={UPDATE_QUESTION_MUTATION}
              variables={this.state}
            >
              {(updateQuestion, { loading, error }) => (
                <Form onSubmit={e => this.updateQuestion(e, updateQuestion)}>
                  <Error error={error} />
                  <h2>Revise Question</h2>
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="question">
                      <textarea
                        name="question"
                        id="question"
                        placeholder="Type your question here"
                        required
                        defaultValue={data.question.question}
                        onChange={this.handleChange}
                        maxLength="200"
                        rows={4}
                        autoComplete="off"
                      />
                      <TextMuted>Question</TextMuted>
                    </label>
                    <label htmlFor="answer">
                      <input
                        type="text"
                        name="answer"
                        id="answer"
                        placeholder="Answer"
                        required
                        defaultValue={data.question.answer}
                        onChange={this.handleChange}
                        autoComplete="off"
                      />
                      <TextMuted>Answer</TextMuted>
                    </label>
                    <Button secondary type="submit">
                      Sav{loading ? 'ing' : 'e'} Changes
                    </Button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default UpdateQuestion;
