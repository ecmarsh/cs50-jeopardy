import React, { useState, Fragment } from 'react';
import Router from 'next/router';
import { Query } from 'react-apollo';
import Error from './ErrorMessage';
import GameReset from './GameReset';
import { CATEGORY_QUESTIONS_QUERY } from './CategoryQuestions';
import formatScore from '../lib/formatScore';
import WagerInputs from './styles/Wagers';
import Cover from './styles/Cover';
import Button from './styles/Button';
import { TextEmph, Divider } from './styles/Utilities';
import { UpdateTeamScoreButton } from './ScoreTeams';
import RoundTimer from './Timer';
import { pluck } from 'ramda';
import SoundEffect from './SoundEffect';
import { Fade, Shift, Unfocus } from './Animated';

function FinalJeopardy({
  teams,
  gameName,
  config,
  category,
  toggleChosenTeam,
}) {
  const [wagers, setWagers] = useState([0, 0]);
  const [stage, setStage] = useState(0);
  const [qId, setQId] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isAnswerShown, setIsAnswerShown] = useState(false);
  const nextStage = (override = false) =>
    setStage(prevStage => (prevStage += 1));
  const showAnswer = () => setIsAnswerShown(true);

  const winner = () => {
    if (teams[0].score < teams[1].score) {
      return `Team ${teams[1].name}`;
    } else if (teams[0].score > teams[1].score) {
      return `Team ${teams[0].name}`;
    }
    return `Both teams win!`; // Must be a tie
  };
  const overrides = {
    position: 'relative',
    top: '5px',
    width: '100%',
    height: '100%',
    transform: 'translateX(-50%)',
  };
  return (
    <Cover style={overrides}>
      <div className="fullscreen__inner">
        <div className="titles">
          <div className="titles__inner">
            <h3>{stage === 4 ? 'CS50 Jeopardy' : category.name}</h3>
          </div>
          <Divider />
        </div>
        {stage === 0 && (
          <TeamWagers
            teams={teams}
            nextStage={nextStage}
            setWagers={setWagers}
          />
        )}
        {stage === 1 && (
          <FinalJeopardyQuestion
            config={config}
            gameName={gameName}
            categoryId={category.id}
            nextStage={nextStage}
            liftQuestion={setQuestion}
            liftAnswer={setAnswer}
            liftQId={setQId}
          />
        )}
        {(stage === 2 || stage === 3) && (
          <PromptAnswer
            key={`promptAnswer${stage}`}
            teams={teams}
            index={stage - 2}
            wagers={wagers}
            nextStage={nextStage}
            question={question}
            answer={answer}
            isAnswerShown={isAnswerShown}
            showAnswer={showAnswer}
            qId={qId}
            categoryId={category.id}
            toggleChosenTeam={toggleChosenTeam}
            gameName={gameName}
          />
        )}
        {stage === 4 && (
          <EndOfGame
            winner={winner()}
            gameName={gameName}
            hasDoubleJeopardy={config.hasDoubleJeopardy}
          />
        )}
      </div>
    </Cover>
  );
}

function TeamWagers({ teams, setWagers, nextStage }) {
  const [wager0, setWager0] = useState(0);
  const [wager1, setWager1] = useState(0);
  const [step, changeStep] = useState(100);
  const [errMessage, setErrMessage] = useState('');
  const wagers = [wager0 | 0, wager1 | 0];

  const validate = () => {
    const scores = pluck('score', teams);
    let e = '';
    scores.forEach((score, i) => {
      if (wagers[i] < 0) e = 'Wagers must be positive!';
      if (score > 1000 && wagers[i] > score) e = 'Max wager is your score!';
      if (score < 1000 && wagers[i] > 1000)
        e = 'Max wager is $1,000 or your score for this game!';
    });
    setErrMessage(e);

    if (e) {
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    const validateInputs = validate();
    if (!validateInputs) return;

    setWagers(wagers);
    nextStage();
  };
  return (
    <Fragment>
      <div className="main__display">
        <WagerInputs>
          <TextEmph>Choose Final Wagers</TextEmph>
          {errMessage && (
            <p style={{ fontSize: 'smaller', opacity: '.8', color: 'red' }}>
              {errMessage}
            </p>
          )}

          {teams.map((team, i) => (
            <label key={`wager-${i}`} htmlFor={`wager${i}`}>
              {team.name}
              <span>
                ${' '}
                <input
                  type="number"
                  required
                  max={team.score <= 0 ? 1000 : team.score}
                  min={0}
                  value={wagers[i]}
                  step={step}
                  name={`wager${i}`}
                  onKeyUp={() => changeStep(1)}
                  onChange={e => {
                    if (!i) {
                      setWager0(e.target.value);
                    } else {
                      setWager1(e.target.value);
                    }
                  }}
                />
              </span>
            </label>
          ))}
          <p className="disclaimer">
            You may have to write down your team{"'"}s answer
          </p>
          <p className="disclaimer smaller">
            ...And cover your eyes for the other teams wager 🙈
          </p>
        </WagerInputs>
      </div>
      <div className="controls">
        <Divider />
        <Button game onClick={() => handleSubmit()}>
          Start Final Round
        </Button>
      </div>
    </Fragment>
  );
}

function FinalJeopardyQuestion({
  config,
  gameName,
  categoryId,
  nextStage,
  liftQId,
  liftQuestion,
  liftAnswer,
}) {
  return (
    <Query
      query={CATEGORY_QUESTIONS_QUERY}
      variables={{ categoryId: categoryId }}
    >
      {({ data: { categoryQuestions }, loading, error }) => {
        if (loading)
          return (
            <div className="main__display">
              <p className="question">Loading...</p>
            </div>
          );
        if (error) return <Error error={error} />;
        const { id, question } = categoryQuestions[0];
        if (config.hasRoundTimer) {
          liftQId(id);
          liftQuestion(question.question);
          liftAnswer(question.answer);
        }
        return (
          <Fragment>
            <div className="main__display">
              <p className="question">{question.question}</p>
              {config.hasRoundTimer && (
                <RoundTimer
                  key={`timerfinal`}
                  gameName={gameName}
                  round={3}
                  roundTime={config.roundTime}
                  finalTime={config.finalTime}
                  nextStage={nextStage}
                />
              )}
            </div>
            <div className="controls">
              <Divider />
              <Button
                game
                onClick={() => {
                  liftQId(id);
                  liftQuestion(question.question);
                  liftAnswer(question.answer);
                  nextStage();
                }}
              >
                End Round
              </Button>
            </div>
            <SoundEffect sound="final-jeopardy" loop />
          </Fragment>
        );
      }}
    </Query>
  );
}

function PromptAnswer({
  teams,
  wagers,
  index,
  nextStage,
  question,
  answer,
  isAnswerShown,
  showAnswer,
  categoryId,
  qId,
  toggleChosenTeam,
  gameName,
}) {
  return (
    <Fragment>
      <div
        className="main__display"
        style={{ alignSelf: 'start', paddingTop: '3rem' }}
      >
        {index === 0 ? (
          <Unfocus off={true}>{question}</Unfocus>
        ) : (
          <p className="question--unfocused question--mounted">{question}</p>
        )}
        {isAnswerShown && index === 0 && <Shift cName="answer">{answer}</Shift>}
        {isAnswerShown && index === 1 && <p className="answer">{answer}</p>}
        <Divider style={{ width: '50%', marginBottom: '3rem' }} />
        <Shift cName="other">
          {teams[index].name} wagered{' '}
          <span>{formatScore(Math.abs(wagers[index]))}</span>
        </Shift>
        <Shift cName="prompt">
          Please show your answer, Team {teams[index].name}.
        </Shift>
      </div>
      <div className="controls">
        <Divider />
        <div className="controls__ctas">
          {!isAnswerShown && (
            <Button game onClick={showAnswer}>
              Show Answer
            </Button>
          )}
          {isAnswerShown &&
            [1, -1].map((multiplier, i) => (
              <UpdateTeamScoreButton
                key={`rightWrong${multiplier}`}
                dataTest={'cta-button-' + i}
                gameName={gameName}
                chosenTeam={teams[index]}
                sumScoreWith={wagers[index] * multiplier}
                categoryId={categoryId}
                categoryQuestionId={qId}
                toggleView={nextStage}
                toggleChosenTeam={toggleChosenTeam}
              >
                {multiplier === 1 ? 'Correct' : 'Incorrect'}
              </UpdateTeamScoreButton>
            ))}
        </div>
      </div>
    </Fragment>
  );
}

function EndOfGame({ winner, gameName, hasDoubleJeopardy }) {
  return (
    <Fragment>
      <div className="main__display">
        <Fade cName="congrats">
          Congratulations,
          <br /> {winner}
        </Fade>
      </div>
      <div className="controls">
        <Divider />
        <GameReset gameName={gameName} hasDoubleJeopardy={hasDoubleJeopardy}>
          {resetGameMutation => (
            <Button
              game
              onClick={async e => {
                if (
                  confirm(`Are you sure you want to reset game ${gameName}`)
                ) {
                  e.preventDefault();
                  await resetGameMutation();
                  Router.push({
                    pathname: `/play`,
                    query: { game: gameName },
                  });
                }
              }}
            >
              Reset Game
            </Button>
          )}
        </GameReset>
      </div>
      <SoundEffect sound="applause" />
    </Fragment>
  );
}

export default FinalJeopardy;
