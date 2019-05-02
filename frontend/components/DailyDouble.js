import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import SoundEffect from './SoundEffect';
import Button from './styles/Button';
import formatScore from '../lib/formatScore';
import { Ease, Loud } from './Animated';

function DailyDouble({ minWager, maxWager, setQuestionPrice, isChosenTeam }) {
  const [wager, setWager] = useState(minWager);
  return (
    <div>
      <SoundEffect sound="daily-double" />
      <Loud off={isChosenTeam}>Daily Double!</Loud>
      {isChosenTeam && (
        <Ease
          data-test="daily-double-form"
          onSubmit={e => {
            e.preventDefault();
            setQuestionPrice(wager);
          }}
        >
          <Field>
            <label>
              <p>
                Set team wager from {formatScore(minWager)} -{' '}
                {formatScore(maxWager)}
              </p>
              <input
                type="number"
                step={100}
                min={minWager}
                max={maxWager}
                value={wager}
                onChange={e => setWager(e.target.value)}
              />
            </label>
            <Button primary type="submit">
              Set Wager
            </Button>
            <Button
              tertiary
              className="contrast"
              type="button"
              onClick={() => setWager(maxWager)}
            >
              Make it a True Daily Double!
            </Button>
          </Field>
        </Ease>
      )}
    </div>
  );
}
DailyDouble.propTypes = {
  minWager: PropTypes.number.isRequired,
  maxWager: PropTypes.number.isRequired,
  setQuestionPrice: PropTypes.func.isRequired,
  isChosenTeam: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
    .isRequired,
};
DailyDouble.defaultProps = {
  minWager: 0,
  maxWager: 1000,
  setQuestionPrice: () => console.log('Missing price setter prop fn'),
  isChosenTeam: false,
};

const Field = styled.fieldset`
  border: none;
  border-image: none;
  line-height: 2;
  label {
    font-size: 2.4rem;
    line-height: 1.5;
  }

  input {
    padding: 1.2rem;
    font-size: 1.6rem;
    text-align: center;
    margin: 2rem auto;
    width: 10rem;
    box-shadow: 0 0 1rem rgba(255, 255, 255, 0.5);
    color: ${props => props.theme.darkGrey};

    &:focus {
      outline-color: ${props => props.theme.primaryDark};
    }
  }
  button {
    display: block;
    margin: 1rem auto;
    &.contrast {
      color: white;
      opacity: 0.8;
      margin-top: 1rem;
      &:hover {
        color: white;
        opacity: 1;
      }
    }
  }
`;

export default DailyDouble;
