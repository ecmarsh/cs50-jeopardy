import React, { useState, useEffect } from 'react';
import Button from './styles/Button';
import { Slide } from './Animated';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import SoundEffect, { sounds, LOCAL_STATE_QUERY } from './SoundEffect';

const TOGGLE_SOUND_MUTATION = gql`
  mutation {
    toggleSound @client
  }
`;

export const ToggleSoundButton = ({ soundOn }) => (
  <Mutation mutation={TOGGLE_SOUND_MUTATION}>
    {toggleSound => {
      return (
        <Button
          tertiary
          on={soundOn}
          className="button--sound"
          onClick={() => toggleSound()}
        >
          AUTOPLAY
        </Button>
      );
    }}
  </Mutation>
);

export default function SoundBar() {
  const [on, toggle] = useState(false);
  const [src, setSrc] = useState('');
  const [hovered, toggleMouse] = useState(false);

  useEffect(() => {
    if (src) toggle(true);
  }, [src]);

  return (
    <Query query={LOCAL_STATE_QUERY}>
      {({ data: { soundOn } }) => (
        <Slide
          className="right"
          data-test="game-sound-bar"
          flip={true}
          onMouseEnter={() => toggleMouse(true)}
          onMouseLeave={() => toggleMouse(false)}
          hovered={hovered}
        >
          <div className={'bar-icon'}>
            <img
              src={`../static/sounds-icon${soundOn ? '--on' : ''}.png`}
              alt="game-control-icon--sound"
            />
          </div>
          <div className="inner">
            {sounds.map((sound, i) => (
              <span key={`sound${i}`}>
                <Button
                  playing={src === sound.file}
                  tertiary
                  onClick={() => {
                    setSrc(sound.file);
                    if (src === sound.file) {
                      toggle(false);
                      setSrc('');
                    }
                  }}
                >
                  {sound.name}
                </Button>
              </span>
            ))}
            <ToggleSoundButton soundOn={soundOn} />
            {on && (
              <SoundEffect
                sound={src}
                disabled={false}
                onEnded={() => {
                  toggle(false);
                  setSrc('');
                }}
              />
            )}
          </div>
        </Slide>
      )}
    </Query>
  );
}
