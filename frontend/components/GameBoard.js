import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import Router from 'next/router';
import { ANSWERED_QUESTIONS_QUERY } from './GameScreen';
import GameCategories from './GameCategories';
import CategoryItems from './GameQuestions';
import Question from './Question';
import StudyQuestion from './QuestionStudy';
import FinalJeopardy from './FinalJeopardy';
import Error from './ErrorMessage';
import { TitleSquare } from './styles/Square';

class GameBoard extends Component {
  state = {
    on: false,
    activeQuestion: {},
  };

  componentDidMount() {
    if (this.props.soundOn && this.props.round < 2) {
      this.sound = new Audio('../static/sounds/fill-board.mp3');
      this.sound.load();
      this.playSound();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { round, isOwner } = this.props;
    if (prevProps.round !== round) {
      this.setState({ on: false });
    }
    if (!isOwner && round === 3) {
      // failsafe for manual url
      Router.push({
        pathname: `/review`,
      });
    }
  }

  playSound() {
    const soundPromise = this.sound.play();
    if (soundPromise !== undefined) {
      soundPromise
        .then(_ => {
          // autoplay started
        })
        .catch(err => {
          // catch dom exception
          console.info(err);
        });
    }
  }

  // Set question to display
  setQuestion = activeQuestion => this.setState({ activeQuestion });

  // Focus or unfocus question
  toggleView = () => this.setState(({ on }) => ({ on: !on }));

  render() {
    const {
      teams,
      gameName,
      round,
      toggleChosenTeam,
      prevChosenTeam,
      config,
      isOwner,
    } = this.props;
    const { on, activeQuestion } = this.state;

    return (
      <Fragment>
        <Query query={ANSWERED_QUESTIONS_QUERY}>
          {({ data: { answeredQuestions }, error }) => {
            if (error) return <Error error={error} />;
            return (
              <GameCategories gameName={gameName} round={round}>
                {({ category }) => (
                  <Fragment>
                    {round < 3 && (
                      <Fragment>
                        <TitleSquare isFinal={round === 3}>
                          <div className="category-title">
                            <h3>{category.name}</h3>
                          </div>
                        </TitleSquare>
                        <CategoryItems
                          categoryId={category.id}
                          round={round}
                          setQuestion={this.setQuestion}
                          toggleView={this.toggleView}
                          isOwner={isOwner}
                          answeredQuestions={answeredQuestions}
                        />
                      </Fragment>
                    )}
                    {isOwner && round === 3 && (
                      <FinalJeopardy
                        gameName={gameName}
                        teams={teams}
                        category={category}
                        config={config}
                        toggleChosenTeam={toggleChosenTeam}
                      />
                    )}
                  </Fragment>
                )}
              </GameCategories>
            );
          }}
        </Query>
        {on && (
          <ShowQuestion
            isOwner={isOwner}
            active={on}
            toggleView={this.toggleView}
            categoryQuestion={activeQuestion}
            category={activeQuestion.category}
            round={round}
            gameName={gameName}
            teams={teams}
            prevChosenTeam={prevChosenTeam}
            toggleChosenTeam={toggleChosenTeam}
          />
        )}
      </Fragment>
    );
  }
}

const ShowQuestion = ({ isOwner, ...rest }) =>
  isOwner ? <Question {...rest} /> : <StudyQuestion {...rest} />;

export default GameBoard;
