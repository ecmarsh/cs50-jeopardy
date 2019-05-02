import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import * as R from 'ramda';
import { useTrail, animated, config } from 'react-spring';
import formatScore from '../lib/formatScore';
import { CATEGORY_QUESTIONS_QUERY } from './CategoryQuestions';
import StyledSquare from './styles/Square';

const GameQuestions = ({
  on = true,
  round,
  toggleView,
  setQuestion,
  categoryId,
  answeredQuestions,
  isOwner,
}) => {
  const trails = useTrail(5, {
    config: { ...config.slow },
    opacity: on ? 1 : 0,
    rt: on ? [1, 0] : [0, 20],
    from: {
      rt: [0, 20],
      opacity: 0,
    },
  });

  return (
    <Query query={CATEGORY_QUESTIONS_QUERY} variables={{ categoryId }}>
      {({ data: { categoryQuestions }, loading }) => {
        if (loading) return <div style={{ height: '15.8%' }} />;
        return (
          <Fragment>
            {trails.map(({ rt, ...trailProps }, i) => (
              <animated.div
                key={categoryQuestions[i].id}
                style={{
                  height: '15.8%',
                  display: 'flex',
                  ...trailProps,
                  transform: rt.interpolate(
                    (r, t) => `rotateY(${r}deg) translate3d(0, ${t}%, 0)`
                  ),
                }}
              >
                <StyledSquare
                  data-test={`game-question-${i}`}
                  answered={
                    isOwner
                      ? categoryQuestions[i].answered
                      : answeredQuestions &&
                        R.includes(
                          categoryQuestions[i].id,
                          R.pluck('id', answeredQuestions)
                        )
                  }
                  isFinal={round === 3}
                  isDouble={categoryQuestions[i].isDouble}
                >
                  <div
                    onClick={() => {
                      // Only show question if not yet answered
                      const isAnswered = isOwner
                        ? categoryQuestions[i].answered
                        : answeredQuestions &&
                          R.includes(
                            categoryQuestions[i].id,
                            R.pluck('id', answeredQuestions)
                          );
                      if (!isAnswered) {
                        toggleView();
                        setQuestion(categoryQuestions[i]);
                      }
                    }}
                  >
                    <span className="question-value">
                      {formatScore(
                        categoryQuestions[i].difficulty * round * 200
                      )}
                    </span>
                  </div>
                </StyledSquare>
              </animated.div>
            ))}
          </Fragment>
        );
      }}
    </Query>
  );
};
GameQuestions.propTypes = {
  answeredQuestions: PropTypes.array, // when using cache
  categoryId: PropTypes.string.isRequired, // to query for its questions
  on: PropTypes.bool, // init the animated trail
  isOwner: PropTypes.bool.isRequired, // determine features
  round: PropTypes.number.isRequired, // single, double jeopardy, etc.
  toggleView: PropTypes.func.isRequired, // to close question
  setQuestion: PropTypes.func.isRequired, // to open question w/ selected
};
GameQuestions.defaultProps = {
  answeredQuestions: [],
  on: true,
  round: 1,
  isOwner: false,
};

export default GameQuestions;
