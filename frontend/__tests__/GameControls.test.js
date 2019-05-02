import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import GameControls from '../components/GameControls';
import { fakeGame, fakeGameConfig } from '../lib/testUtils';

const game = fakeGame();
const config = fakeGameConfig();

describe('<GameControls />', () => {
  it('renders game controls and matches snapshot for owner game', async () => {
    const wrapper = mount(
      <MockedProvider>
        <GameControls
          gameName={game.name}
          round={1}
          isOwner={true}
          config={config}
        />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const ownerGameControls = wrapper.find('div[data-test="game-control-bar"]');
    expect(toJSON(ownerGameControls)).toMatchSnapshot();
  });
});
