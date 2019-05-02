import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Link from 'next/link';
import { format } from 'date-fns';
import FullScreen from './styles/FullScreen';
import { TextEmph, TextMuted } from './styles/Utilities';
import Button from './styles/Button';

const StyledMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  width: 50vw;
  margin: 0 auto;
  background: ${props => props.theme.white};
  box-shadow: ${props => props.theme.bs};
  border-radius: 1rem;
  padding: 5rem 1rem;
`;

const SINGLE_QUESTION_QUERY = gql`
  query SINGLE_QUESTION_QUERY($id: ID!) {
    question(where: { id: $id }) {
      id
      question
      answer
      createdAt
    }
  }
`;

class ThankYou extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
  };
  render() {
    const { id, updated } = this.props;
    return (
      <FullScreen>
        <Query query={SINGLE_QUESTION_QUERY} variables={{ id }}>
          {({ data: { question }, loading }) => {
            if (loading) return <p>Loading...</p>;
            if (!question) return <p>Unable to load question.</p>;
            return (
              <StyledMessage>
                <h2>
                  {updated ? 'Question Updated!' : 'Thanks for submitting!'}
                </h2>

                <p>
                  <strong>Q: </strong> <TextEmph>{question.question}</TextEmph>
                </p>
                <p>
                  <strong>A: </strong> <TextEmph>{question.answer}</TextEmph>
                </p>

                <div style={{ marginTop: '1rem' }}>
                  <Link href="submit">
                    <Button tertiary>
                      <strong>Submit Another</strong>
                    </Button>
                  </Link>
                  <span style={{ padding: '1rem' }}>&nbsp;</span>
                  <Link
                    href={{
                      pathname: 'edit',
                      query: { id },
                    }}
                  >
                    <Button tertiary>
                      <strong>Edit </strong>
                      <img
                        src="../static/pencil-edit-button.png"
                        alt="pencil-edit-icon"
                        height="10px"
                        style={{ marginLeft: '2px' }}
                      />
                    </Button>
                  </Link>
                </div>

                <p className="submit-id">
                  <TextMuted>
                    Submitted on:{' '}
                    {format(question.createdAt, 'MMMM d, YYYY h:mm a')}
                  </TextMuted>
                </p>
              </StyledMessage>
            );
          }}
        </Query>
      </FullScreen>
    );
  }
}

export default ThankYou;
export { SINGLE_QUESTION_QUERY };
