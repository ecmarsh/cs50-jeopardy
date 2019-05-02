import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { fakeGame } from '../lib/testUtils';
import TeamScoreboard from '../components/ScoreTeams';

describe('<UpdateTeamScores />', () => {
  it('renders team scoreboard and matches snapshot', async () => {
    const game = fakeGame();
    const scoreboardProps = {
      teams: game.teams,
      chosen: game.teams[0].id,
      prevChosen: game.teams[1].id,
    };
    const wrapper = shallow(<TeamScoreboard {...scoreboardProps} />);
    expect(toJSON(wrapper.find('Scoreboard'))).toMatchSnapshot();
  });
});
