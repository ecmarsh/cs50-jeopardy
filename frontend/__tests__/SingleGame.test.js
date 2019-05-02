import { UserGameListItem } from '../components/GamesUser';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';

const fakeGame = {
  id: 'GAMEID12345',
  name: 'Awesome Game',
  createdAt: '2019-03-27T05:48:47.017Z',
};

describe('<GameListItem/>', () => {
  it('renders and matches the snapshot', () => {
    const wrapper = shallow(<UserGameListItem game={fakeGame} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
