import React, { Component, useState } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import * as R from 'ramda';
import Button from './styles/Button';
import StyledScoreboard, { TeamContainer } from './styles/Scoreboard';
import { SINGLE_GAME_QUERY } from './GameSetup';
import { CATEGORY_QUESTIONS_QUERY } from './CategoryQuestions';
import { Tally } from './Animated';

const UPDATE_TEAM_SCORE_MUTATION = gql`
  mutation UPDATE_TEAM_SCORE_MUTATION(
    $teamId: ID!
    $score: Int!
    $categoryQuestionId: ID!
    $answered: Boolean
  ) {
    updateTeamScore(id: $teamId, score: $score) {
      id
      score
    }
    updateAnsweredQuestion(id: $categoryQuestionId, answered: $answered) {
      id
      answered
    }
  }
`;

const TeamScores = ({ teams, chosen, prevChosen }) => {
  return (
    <StyledScoreboard>
      {teams.map(({ id, name, score }, i) => (
        <TeamContainer
          key={id}
          chosen={chosen === id}
          prevChosen={prevChosen === id}
        >
          <p className="team-label">{name}</p>
          <Tally key={`${score}-${i}`} score={score} />
        </TeamContainer>
      ))}
    </StyledScoreboard>
  );
};

const UpdateTeamScoreButton = ({
  children,
  chosenTeam,
  sumScoreWith,
  categoryQuestionId,
  toggleView,
  gameName,
  categoryId,
  toggleChosenTeam,
  dataTest,
}) => {
  // Score to update db
  const updatedScore = chosenTeam.score + sumScoreWith;
  // Show on UI
  const optimisticResponse = {
    __typename: 'Mutation',
    updateTeamScore: {
      id: chosenTeam.id,
      score: updatedScore,
      __typename: 'Team',
    },
    updateAnsweredQuestion: {
      id: categoryQuestionId,
      answered: true,
      __typename: 'CategoryQuestion',
    },
  };
  // Local cache updates
  const update = (
    cache,
    { data: { updateTeamScore, updateAnsweredQuestion } }
  ) => {
    /*
     * Update gameboard cache
     */
    const { game } = cache.readQuery({
      query: SINGLE_GAME_QUERY,
      variables: { name: gameName },
    });
    const teamIdx = R.findIndex(R.propEq('id', updateTeamScore.id), game.teams);
    game.teams[teamIdx].score = updateTeamScore.score;
    cache.writeQuery({
      query: SINGLE_GAME_QUERY,
      variables: { name: gameName },
      data: { game },
    });

    /*
     * Update gameboard cache
     */
    const { categoryQuestions } = cache.readQuery({
      query: CATEGORY_QUESTIONS_QUERY,
      variables: { categoryId },
    });
    const questionIdx = R.findIndex(
      R.propEq('id', updateAnsweredQuestion.id),
      categoryQuestions
    );
    categoryQuestions[questionIdx].answered = updateAnsweredQuestion.answered;
    cache.writeQuery({
      query: CATEGORY_QUESTIONS_QUERY,
      variables: { categoryId },
      data: { categoryQuestions },
    });
  };

  return (
    <Mutation mutation={UPDATE_TEAM_SCORE_MUTATION}>
      {(updateTeamScore, { error }) => {
        if (error) alert(error);
        return (
          <Button
            game
            type="button"
            data-test={dataTest}
            onClick={async e => {
              e.preventDefault();
              toggleView();
              toggleChosenTeam('');

              const res = await updateTeamScore({
                variables: {
                  teamId: chosenTeam.id,
                  score: updatedScore,
                  categoryQuestionId,
                  answered: true,
                },
                optimisticResponse,
                update,
              });
            }}
          >
            {children}
          </Button>
        );
      }}
    </Mutation>
  );
};

export default TeamScores;
export { UPDATE_TEAM_SCORE_MUTATION, UpdateTeamScoreButton };
