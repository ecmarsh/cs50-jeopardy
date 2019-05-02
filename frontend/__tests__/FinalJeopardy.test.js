import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';
import FinalJeopardy from '../components/FinalJeopardy';
import { CATEGORY_QUESTIONS_QUERY } from '../components/CategoryQuestions';
import {
  fakeGame,
  fakeGameConfig,
  fakeCategoryQuestion,
} from '../lib/testUtils';
import { LOCAL_STATE_QUERY } from '../components/SoundEffect';

const game = fakeGame();
const config = fakeGameConfig();
const categoryQuestion = fakeCategoryQuestion();

const mockProps = {
  teams: game.teams,
  gameName: game.name,
  config,
  category: categoryQuestion.category,
  toggleChosenTeam: jest.fn(),
};

const mocks = [
  {
    request: {
      query: CATEGORY_QUESTIONS_QUERY,
      variables: { categoryId: categoryQuestion.category.id },
    },
    result: {
      data: { categoryQuestions: [categoryQuestion] },
    },
  },
  {
    request: {
      query: LOCAL_STATE_QUERY,
    },
    result: {
      data: { soundOn: false },
    },
  },
];

describe('<FinalJeopardy />', () => {
  it('renders final jeopardy form and matches snapshot', () => {
    const wrapper = mount(<FinalJeopardy {...mockProps} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('shows accurate control for each stage', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <FinalJeopardy {...mockProps} />
      </MockedProvider>
    );
    wrapper.find('button').simulate('click');
    await wait();
    wrapper.update();
    expect(wrapper.find('button').text()).toContain('End Round');
    wrapper.find('button').simulate('click');
    await wait();
    wrapper.update();
    expect(wrapper.find('button').text()).toContain('Show Answer');
    wrapper.find('button').simulate('click');
    await wait();
    wrapper.update();
    expect(wrapper.exists('p.answer')).toEqual(true);
    expect(wrapper.find('button[data-test="cta-button-0"]').text()).toContain(
      'Correct'
    );
  });

  it('renders countdown when enabled and matches snap', async () => {
    config.hasRoundTimer = true; // turn on timer
    config.finalTime = 30; // give it some seconds
    const wrapper = mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <FinalJeopardy {...mockProps} />
      </MockedProvider>
    );
    // next screen
    wrapper.find('button').simulate('click');
    await wait();
    wrapper.update();
    expect(wrapper.exists('RoundTimer')).toEqual(true);
    expect(toJSON(wrapper.find('RoundTimer'))).toMatchSnapshot();
  });
});
