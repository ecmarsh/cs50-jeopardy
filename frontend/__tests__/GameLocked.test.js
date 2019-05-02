import { mount } from 'enzyme';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';
import { fakeGame } from '../lib/testUtils';
import GameLoad from '../components/GameLoad';
import { SINGLE_GAME_QUERY } from '../components/GameSetup';

describe('<GameLocked />', () => {
  it('does not allow edits when published', async () => {
    const game = fakeGame();
    if (!game.isPublic) game.isPublic = true;

    const publishedMock = {
      request: { query: SINGLE_GAME_QUERY, variables: { name: game.name } },
      result: { data: { game } },
    };

    const wrapper = mount(
      <MockedProvider mocks={[publishedMock]} addTypename={false}>
        <GameLoad game={game.name} round={1} />
      </MockedProvider>
    );

    expect(wrapper.text()).toContain('Loading');
    await wait(0);
    wrapper.update();

    expect(wrapper.text()).toContain('Locked!');
    expect(wrapper.exists('button[data-test="unpublish-game-button"]')).toEqual(
      true
    );
  });
});
