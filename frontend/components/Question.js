import React, { Component, Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { max } from 'ramda';
import formatScore from '../lib/formatScore';
import Button from './styles/Button';
import { UpdateTeamScoreButton } from './ScoreTeams';
import { Divider } from './styles/Utilities';
import DailyDouble from './DailyDouble';
import { Grow, Shift, Unfocus } from './Animated';

class GamePlayQuestion extends Component {
  state = {
    chosenTeam: {},
    showAnswer: false,
    gen: this.stages(),
  };

  *stages() {
    const {
      gameName,
      round,
      category,
      categoryQuestion,
      toggleChosenTeam,
      toggleView,
      teams,
    } = this.props;

    // CHOOSE ANSWERING TEAM
    yield (
      <Fragment key={`stage1`}>
        <Shift cName="controls__message">Which team is answering?</Shift>
        <div className="controls__ctas">
          {teams.map((team, idx) => (
            <Button
              key={'teambutton-' + idx}
              data-test={'cta-button-' + idx}
              game
              onClick={e =>
                this.setChosenTeam(e, idx, team.id, team.name, team.score)
              }
            >
              Team {team.name}
            </Button>
          ))}
        </div>
      </Fragment>
    );
    // AWAITING DOUBLE JEOPARDY WAGER
    if (categoryQuestion.isDouble) {
      yield <Shift cName="controls__message">Waiting for wager...</Shift>;
    }
    // REVEAL ANSWER
    yield (
      <Fragment key={`stage2`}>
        <Shift cName="controls__message">Waiting for answer...</Shift>
        <Button
          data-test="cta-button-1"
          game
          onClick={() => {
            this.setState({ showAnswer: true });
          }}
        >
          Show Answer
        </Button>
      </Fragment>
    );
    // RIGHT OR WRONG
    yield (
      <Fragment key={`stage3`}>
        <Shift cName="controls__message">Were they correct?</Shift>
        <div className="controls__ctas">
          {[1, -1].map((multiplier, n) => (
            <UpdateTeamScoreButton
              key={'rightwrong' + n}
              data-test={'cta-button-' + n}
              dataTest={'cta-button-' + n}
              gameName={gameName}
              chosenTeam={this.state.chosenTeam}
              sumScoreWith={
                (this.state.override ||
                  categoryQuestion.difficulty * (round * 200)) * multiplier
              }
              categoryId={category.id}
              categoryQuestionId={categoryQuestion.id}
              toggleView={toggleView}
              toggleChosenTeam={toggleChosenTeam}
            >
              {multiplier === 1 ? 'Correct' : 'Incorrect'}
            </UpdateTeamScoreButton>
          ))}
        </div>
      </Fragment>
    );
    // Updating the score will unmount component
    return null;
  }

  setChosenTeam = (e, idx, id, name, score) => {
    e.preventDefault();
    const chosenTeam = { idx, id, name, score };
    this.props.toggleChosenTeam(id);
    this.setState(prevState => ({
      teamShown: !prevState.teamShown,
      chosenTeam,
    }));
  };

  overrideQuestionPrice = override => this.setState({ override }); // set 2x wager

  render() {
    const { round, category, categoryQuestion, active } = this.props;
    const questionPrice =
      this.state.override || categoryQuestion.difficulty * (round * 200);
    const { chosenTeam, gen, showAnswer } = this.state;

    return (
      <Grow active={active}>
        <div className="fullscreen__inner">
          <div className="titles">
            <div className="titles__inner">
              <h3>{category.name}</h3>
              <h3>{formatScore(questionPrice)}</h3>
            </div>
            <Divider />
          </div>

          <div className="main__display">
            {categoryQuestion.isDouble && !this.state.override && (
              <DailyDouble
                setQuestionPrice={this.overrideQuestionPrice}
                override={this.state.override}
                isChosenTeam={Boolean(chosenTeam.id)}
                minWager={round * 200}
                maxWager={max(chosenTeam.score, round * 1000)}
              />
            )}
            {(!categoryQuestion.isDouble || this.state.override) && (
              <>
                <Unfocus off={showAnswer}>
                  {categoryQuestion.question.question}
                </Unfocus>
                {showAnswer && (
                  <Shift cName="answer">
                    {categoryQuestion.question.answer}
                  </Shift>
                )}
              </>
            )}
          </div>

          <div className="controls">
            <Divider />
            {gen.next().value}
          </div>
        </div>
      </Grow>
    );
  }
}

export default GamePlayQuestion;
