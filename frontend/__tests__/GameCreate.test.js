import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import CreateGame, { CREATE_GAME_MUTATION } from '../components/GameCreate';
import { USER_GAMES_QUERY } from '../components/GamesUser';
import { SINGLE_GAME_QUERY } from '../components/GameSetup';
import Router from 'next/router';
import { fakeGame, fakeCategory } from '../lib/testUtils';

describe('<GameCreate />', () => {
  it('renders game create form and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateGame />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const form = wrapper.find('form[data-test="create-game-form"]');
    expect(toJSON(form)).toMatchSnapshot();
  });

  it('updates state on input', async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateGame />
      </MockedProvider>
    );
    wrapper.find('#gameName').simulate('change', {
      target: { value: 'test game', name: 'gameName' },
    });
    expect(wrapper.find('CreateGame').instance().state).toMatchObject({
      gameName: 'test game',
    });
  });

  it('does the game create mutation', async () => {
    const game = fakeGame();
    const cat = fakeCategory();
    const gameMock = {
      request: {
        query: CREATE_GAME_MUTATION,
        variables: { gameName: game.name },
      },
      result: {
        data: {
          createGame: {
            id: game.id,
            name: game.name,
            createdAt: game.createdAt,
            __typename: 'Game',
          },
          categoryOne: cat,
          categoryTwo: cat,
          categoryThree: cat,
          categoryFour: cat,
          categoryFive: cat,
          categorySix: cat,
          categorySeven: cat,
          categoryEight: cat,
          categoryNine: cat,
          categoryTen: cat,
          categoryFinal: cat,
        },
      },
    };
    const refetchMock = {
      request: {
        query: USER_GAMES_QUERY,
      },
      result: {
        data: {
          myGames: [game],
        },
      },
    };
    const gameQuery = {
      request: {
        query: SINGLE_GAME_QUERY,
      },
      result: {
        data: { game },
      },
    };
    const wrapper = mount(
      <MockedProvider mocks={[gameMock, refetchMock]} addTypename={false}>
        <CreateGame />
      </MockedProvider>
    );

    wrapper.find('#gameName').simulate('change', {
      target: { value: game.name, name: 'gameName' },
    });
    Router.router = { push: jest.fn() };
    wrapper.find('form[data-test="create-game-form"]').simulate('submit');
    await wait(50);
    wrapper.update();
    expect(Router.router.push).toHaveBeenCalled();
    const nextRoute = {
      pathname: '/setup',
      query: { game: game.name },
    };
    expect(Router.router.push).toHaveBeenCalledWith(nextRoute);
  });
});
