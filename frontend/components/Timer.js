import React, { Component } from 'react';
import styled, { keyframes, css } from 'styled-components';
import Link from 'next/link';
import { Countdown } from './Views';
import SoundEffect from './SoundEffect';

const StyledTimer = styled.div`
  color: ${props => props.theme.grey};
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);

  ${props =>
    props.final &&
    css`
      position: relative;
      margin-top: 4rem;
    `}
  span {
    color: ${props => props.theme.primary};
    margin-left: 1rem;
    font-size: 1.1em;
  }
`;

const popup = keyframes`
  from {
    transform: translate3d(0, 10rem, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
`;

const EndOfRoundAlert = styled.div`
  background: ${props => props.theme.alertBg};
  color: ${props => props.theme.alert};
  padding: 1rem;
  transform: translateY(0);
  border: 2px solid ${props => props.theme.gold};
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 10rem 5rem 2rem rgba(255, 255, 255, 0.2);
  animation: ${popup} 0.5s cubic-bezier(0.07, 0.66, 0.56, 1.32);
  h2,
  a {
    padding: 0 1rem;
  }
`;

class RoundTimer extends Component {
  state = {
    initialTime: -1,
    timeRemaining: -1,
  };

  componentDidMount() {
    const { roundTime, finalTime, round } = this.props;
    const initialTime = round === 3 ? finalTime : roundTime;
    this.setState({
      initialTime,
      timeRemaining: initialTime,
    });
    // Update per second for final jeopardy
    const updateInterval = round === 3 ? 1000 : 60000; // 1 min or 1 second
    this.roundTimer = setInterval(() => this.updateTimer(), updateInterval);
  }

  componentDidUpdate = prevProps => {
    // Reset timer on round change
    if (prevProps.round !== this.props.round) {
      const timeRemaining =
        this.props.round === 3 ? this.props.finalTime : this.props.roundTime;
      this.setState({ timeRemaining });
    }
  };

  updateTimer() {
    if (this.state.timeRemaining === 1) {
      this.setState({ timeRemaining: 0 });
      clearInterval(this.roundTimer);
      return;
    }

    this.setState(prevState => ({
      timeRemaining: prevState.timeRemaining - 1,
    }));
  }

  componentWillUnmount() {
    clearInterval(this.roundTimer);
  }

  render() {
    const { initialTime, timeRemaining } = this.state;
    const { round, gameName, nextStage } = this.props;
    if (timeRemaining === 0) {
      return (
        <EndOfRoundAlert>
          <h2>⚠️ TIMES UP!</h2>
          {round <= 2 && (
            <Link
              href={{
                pathname: 'play',
                query: { game: gameName, round: round + 1 },
              }}
            >
              <a> Next Round ▷</a>
            </Link>
          )}
          {round === 3 && nextStage()}
          <SoundEffect sound="times-up" />
        </EndOfRoundAlert>
      );
    }

    return (
      <StyledTimer final={round === 3}>
        <Countdown
          round={round}
          animationTime={round < 3 ? initialTime * 60 : initialTime}
          timeRemaining={timeRemaining}
        />
      </StyledTimer>
    );
  }
}

export default RoundTimer;
