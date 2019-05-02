import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import Question from '../components/Question';
import DailyDouble from '../components/DailyDouble';
import { fakeGame, fakeCategory } from '../lib/testUtils';

const game = fakeGame();
const category = updatedFakeCategory();

const mockProps = {
  gameName: game.name,
  round: 1,
  category: category.id,
  categoryQuestion: category.categoryQuestions[1],
  toggleChosenTeam: jest.fn(),
  toggleView: jest.fn(),
  teams: game.teams,
  active: true,
};
const ddProps = {
  minWager: 400,
  maxWager: 1000,
  setQuestionPrice: jest.fn(),
  isChosenTeam: true,
};

describe('<DailyDouble />', () => {
  beforeEach(() => {
    mockProps.toggleView.mockClear();
    mockProps.toggleChosenTeam.mockClear();
  });
  it('mounts daily double when question is double', async () => {
    const wrapper = shallow(<Question {...mockProps} />);
    const btn = 'Button[data-test="cta-button-1"]';
    wrapper.find(btn).simulate('click', {
      preventDefault: jest.fn(),
    });
    await wait();
    wrapper.update();
    expect(wrapper.exists('DailyDouble')).toEqual(true);
  });
  it('renders wager form matches daily double snapshot', () => {
    const wrapper = shallow(<DailyDouble {...ddProps} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
  it('overrides question price when submitted', () => {
    const wrapper = shallow(<DailyDouble {...ddProps} />);
    wrapper
      .find('Ease[data-test="daily-double-form"]')
      .simulate('submit', { preventDefault: jest.fn() });

    expect(ddProps.setQuestionPrice).toHaveBeenCalled();
  });
});

function updatedFakeCategory() {
  const _categories = fakeCategory();
  // Ensure both questions are available
  _categories.categoryQuestions[0].answered = false;
  _categories.categoryQuestions[1].answered = false;
  // Set on/off daily double setting
  _categories.categoryQuestions[0].isDouble = false;
  _categories.categoryQuestions[1].isDouble = true;

  return _categories;
}
