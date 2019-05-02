import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import Question from '../components/Question';
import { fakeGame, fakeCategory } from '../lib/testUtils';

const game = fakeGame();
const category = updatedFakeCategory();

const mockProps = {
  gameName: game.name,
  round: 1,
  category: category.id,
  categoryQuestion: category.categoryQuestions[0],
  toggleChosenTeam: jest.fn(),
  toggleView: jest.fn(),
  teams: game.teams,
  active: true,
};

describe('<GameQuestion />', () => {
  beforeEach(() => {
    mockProps.toggleView.mockClear();
    mockProps.toggleChosenTeam.mockClear();
  });
  it('renders active question and matches snapshot', async () => {
    const wrapper = shallow(<Question {...mockProps} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
  it('renders next stage after choosing team', async () => {
    const wrapper = shallow(<Question {...mockProps} />);
    const button = wrapper.find('Button[data-test="cta-button-1"]');
    expect(
      Object.getOwnPropertyNames(wrapper.instance().state.chosenTeam)
    ).toHaveLength(0);
    button.simulate('click', {
      preventDefault: jest.fn(),
    });
    await wait();
    wrapper.update();

    expect(
      Object.getOwnPropertyNames(wrapper.instance().state.chosenTeam)
    ).toHaveLength(4);
    expect(wrapper.find('Button[data-test="cta-button-1"]').text()).toContain(
      'Show Answer'
    );
  });
  it('renders answer when show answer is clicked', async () => {
    const wrapper = shallow(<Question {...mockProps} />);
    const btn = 'Button[data-test="cta-button-1"]';

    wrapper.find(btn).simulate('click', {
      preventDefault: jest.fn(),
    });
    await wait();
    wrapper.update();
    const answer = wrapper
      .find('Shift')
      .filterWhere(n => n.get(0).props.cName === 'answer');
    expect(answer).toHaveLength(0);
    wrapper.find(btn).simulate('click', {
      preventDefault: jest.fn(),
    });
    await wait();
    wrapper.update();
    const answer2 = wrapper
      .find('Shift')
      .filterWhere(n => n.get(0).props.cName === 'answer');
    expect(answer2).toHaveLength(1);
    expect(answer2.children().text()).toContain(
      mockProps.categoryQuestion.question.answer
    );

    expect(
      wrapper
        .find(`UpdateTeamScore${btn}`)
        .children()
        .text()
    ).toContain('Incorrect');
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
