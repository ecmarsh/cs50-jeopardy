import { mount } from 'enzyme';
import wait from 'waait';
import StudyGames, { PLAYED_GAMES_QUERY } from '../components/StudyGames';
import { MockedProvider } from 'react-apollo/test-utils';
import { fakeStudyGame } from '../lib/testUtils';

const studyGame = fakeStudyGame('SG1');
const studyGame2 = fakeStudyGame('SG2');

const noGamesMock = {
  request: { query: PLAYED_GAMES_QUERY },
  result: { data: { studyGames: [] } },
};
const withGamesMock = {
  request: { query: PLAYED_GAMES_QUERY },
  result: { data: { studyGames: [studyGame, studyGame2] } },
};

describe('<StudyGames />', () => {
  it('should show a link when there are no played games', async () => {
    const wrapper = mount(
      <MockedProvider mocks={[noGamesMock]} addTypenames={false}>
        <StudyGames />
      </MockedProvider>
    );
    expect(wrapper.text()).toContain('Loading');
    await wait();
    wrapper.update();
    expect(wrapper.exists('a')).toEqual(true);
    expect(wrapper.find('a').text()).toContain('Play a game');
  });

  it('should render both played games with no query', async () => {
    const wrapper = mount(
      <MockedProvider mocks={[withGamesMock]} addTypename={false}>
        <StudyGames game={null} />
      </MockedProvider>
    );
    expect(wrapper.text()).toContain('Loading');
    await wait();
    wrapper.update();
    expect(wrapper.exists(`#${studyGame.id}`)).toEqual(true);
    expect(wrapper.exists(`#${studyGame2.id}`)).toEqual(true);
  });

  it('should only show one game with id query', async () => {
    const wrapper = mount(
      <MockedProvider mocks={[withGamesMock]} addTypename={false}>
        <StudyGames game={studyGame.id} />
      </MockedProvider>
    );
    expect(wrapper.text()).toContain('Loading');
    await wait();
    wrapper.update();
    expect(wrapper.exists(`#${studyGame.id}`)).toEqual(true);
    expect(wrapper.exists(`#${studyGame2.id}`)).toEqual(false);
  });

  it('should show an option to remove game', async () => {
    const wrapper = mount(
      <MockedProvider mocks={[withGamesMock]} addTypename={false}>
        <StudyGames game={studyGame.id} />
      </MockedProvider>
    );
    expect(wrapper.text()).toContain('Loading');
    await wait();
    wrapper.update();
    expect(wrapper.exists(`button`)).toEqual(true);
    expect(wrapper.find('button').text()).toContain('Remove');
  });
});
