import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import formatScore from '../lib/formatScore';
import Button from './styles/Button';
import { ResolveAnsweredQuestionButton as QuestionResolver } from './ScoreUser';
import { Divider } from './styles/Utilities';
import { Grow, Fade, Shift, Unfocus } from './Animated';

function StudyQuestion({
  round,
  category,
  categoryQuestion,
  toggleView,
  active,
}) {
  const [isAnswerShown, showAnswer] = useState(false);
  const questionPrice = categoryQuestion.difficulty * (round * 200);

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
          <Unfocus off={showAnswer}>
            {categoryQuestion.question.question}
          </Unfocus>
          {isAnswerShown && (
            <Shift cName="answer">{categoryQuestion.question.answer}</Shift>
          )}
        </div>

        <Fade key={`ctas-${Number(isAnswerShown)}`}>
          <Divider />
          {!isAnswerShown && (
            <>
              <Button game onClick={() => showAnswer(true)}>
                SHOW ANSWER
              </Button>
            </>
          )}
          {isAnswerShown && (
            <div className="controls__ctas">
              {[1, -1].map(multiplier => (
                <QuestionResolver
                  key={`mult-${multiplier}`}
                  id={categoryQuestion.id}
                  val={questionPrice * multiplier}
                  toggleView={toggleView}
                >
                  {multiplier === 1 ? 'Correct' : 'Incorrect'}
                </QuestionResolver>
              ))}
            </div>
          )}
        </Fade>
      </div>
    </Grow>
  );
}

export default StudyQuestion;
