import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import PublicGames from '../components/GamesPublic';
import { fakeGame } from '../lib/testUtils';
import { GAMES_QUERY } from '../components/GamesList';

const { id, name, user } = fakeGame();

const publicGame = {
  id: 'pubGameID',
  name: 'Pubby Game',
  isPublic: true,
  user: { id: 'pgUID' },
};
const privateGame = {
  id,
  name,
  isPublic: false,
  user: { id: user.id },
};

describe('<PublicGames/>', () => {
  it('renders only public games and matches snap', async () => {
    const games = [publicGame, privateGame];
    const gamesMock = {
      request: { query: GAMES_QUERY },
      result: { data: { games } },
    };

    const wrapper = mount(
      <MockedProvider mocks={[gamesMock]} addTypename={false}>
        <PublicGames />
      </MockedProvider>
    );

    expect(wrapper.text()).toContain('Loading');
    await wait(0);
    wrapper.update();

    const form = wrapper.find('form[data-test="public-games-form"]');
    expect(toJSON(form)).toMatchSnapshot();
  });

  it('shows an alert when there are no published games', async () => {
    const games = [privateGame];
    const noPublishedGamesMock = {
      request: { query: GAMES_QUERY },
      result: { data: { games } },
    };
    const wrapper = mount(
      <MockedProvider mocks={[noPublishedGamesMock]} addTypename={false}>
        <PublicGames />
      </MockedProvider>
    );
    await wait(0);
    wrapper.update();

    expect(wrapper.exists('Alert')).toEqual(true);
  });
});
