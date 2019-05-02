import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const LOCAL_STATE_QUERY = gql`
  query {
    soundOn @client
  }
`;

const sounds = [
  { name: 'Aww', file: 'aww', duration: 2000 },
  { name: 'Clap', file: 'applause', duration: 7000 },
  { name: 'Correct', file: 'correct', duration: 2000 },
  { name: 'Daily Double', file: 'daily-double', duration: 3000 },
  { name: 'Fill Board', file: 'fill-board', duration: 4000 },
  { name: 'Final Jeopardy', file: 'final-jeopardy', duration: 32000 },
  { name: 'Thinking', file: 'thinking', duration: 61000 },
  { name: 'Times Up', file: 'times-up', duration: 1000 },
  { name: 'Wrong', file: 'wrong', duration: 550 },
];

const SoundEffect = ({ sound, disabled, ...rest }) => (
  <Query query={LOCAL_STATE_QUERY}>
    {({ data: { soundOn } }) => {
      return (
        <span>
          {(soundOn || disabled === false) && (
            <audio autoPlay src={`../static/sounds/${sound}.mp3`} {...rest} />
          )}
        </span>
      );
    }}
  </Query>
);
SoundEffect.propTypes = {
  sound: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};
SoundEffect.defaultProps = {
  sound: 'wrong',
};

export default SoundEffect;
export { LOCAL_STATE_QUERY, sounds };
