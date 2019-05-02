import React, { useState } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Button from './styles/Button';
import StyledScoreboard, { TeamContainer } from './styles/Scoreboard';
import { Tally } from './Animated';
import { ANSWERED_QUESTIONS_QUERY } from './GameScreen';
import * as R from 'ramda';

const UPDATE_LOCAL_SCORE_MUTATION = gql`
  mutation($id: ID!, $val: Int!) {
    addAnswered(id: $id, val: $val) @client
  }
`;

function ResolveAnsweredQuestionButton({
  id,
  val,
  toggleView,
  children,
  ...rest
}) {
  const handleClick = (e, addAnsweredMutation) => {
    e.preventDefault();
    const variables = { id, val };
    const res = addAnsweredMutation({ variables });
    toggleView();
  };
  return (
    <Mutation mutation={UPDATE_LOCAL_SCORE_MUTATION}>
      {addAnswered => (
        <Button game onClick={e => handleClick(e, addAnswered)} {...rest}>
          {children}
        </Button>
      )}
    </Mutation>
  );
}

function UserScore(props) {
  return (
    <StyledScoreboard>
      <TeamContainer>
        <p className="team-label">Score</p>
        <Query query={ANSWERED_QUESTIONS_QUERY}>
          {({ data: { answeredQuestions } }) => {
            const score = R.pluck('val', answeredQuestions).reduce((a, b) => {
              return a + b;
            }, 0);
            return <Tally key={`s-${score}`} score={score} />;
          }}
        </Query>
      </TeamContainer>
    </StyledScoreboard>
  );
}

export default UserScore;
export { UPDATE_LOCAL_SCORE_MUTATION, ResolveAnsweredQuestionButton };
