import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import GameSounds from '../components/GameSounds';
import { LOCAL_STATE_QUERY } from '../components/SoundEffect';

const soundOnMock = {
  request: { query: LOCAL_STATE_QUERY },
  result: { data: { soundOn: true } },
};
const soundOffMock = {
  request: { query: LOCAL_STATE_QUERY },
  result: { data: { soundOn: false } },
};

describe('<GameSounds />', () => {
  it('renders soundbar and matches snapshot with sound OFF', async () => {
    const wrapper = mount(
      <MockedProvider mocks={[soundOffMock]} addTypename={false}>
        <GameSounds />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const sounds = wrapper.find('div[data-test="game-sound-bar"]');
    expect(toJSON(sounds)).toMatchSnapshot();
  });
  it('renders soundbar and matches snap with sound ON', async () => {
    const wrapper = mount(
      <MockedProvider mocks={[soundOnMock]} addTypename={false}>
        <GameSounds />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const sounds = wrapper.find('div[data-test="game-sound-bar"]');
    expect(toJSON(sounds)).toMatchSnapshot();
  });
});
