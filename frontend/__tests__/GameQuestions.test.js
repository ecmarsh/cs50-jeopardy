import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import CategoryGameQuestions from '../components/GameQuestions';
import { CATEGORY_QUESTIONS_QUERY } from '../components/CategoryQuestions';
import { fakeCategory } from '../lib/testUtils';

const category = fakeCategory();
category.categoryQuestions[0].answered = false;
category.categoryQuestions[1].answered = true;

const mocks = [
  {
    request: {
      query: CATEGORY_QUESTIONS_QUERY,
      variables: { categoryId: category.id },
    },
    result: { data: { categoryQuestions: category.categoryQuestions } },
  },
];

const mockProps = {
  round: 1,
  toggleView: jest.fn(),
  setQuestion: jest.fn(),
  categoryId: category.id,
  isOwner: true,
};

describe('Game Questions in Single Category', () => {
  beforeEach(() => {
    mockProps.toggleView.mockClear();
    mockProps.setQuestion.mockClear();
  });

  it('renders unanswered questions correctly and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CategoryGameQuestions {...mockProps} />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const question = wrapper.find('div[data-test="game-question-0"]');
    expect(question.text()).toContain('$200');
    expect(toJSON(question)).toMatchSnapshot();
  });

  it('renders answered questions correctly and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CategoryGameQuestions {...mockProps} />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const question = wrapper.find('div[data-test="game-question-1"]');
    expect(question.text()).toContain('$400');
    expect(toJSON(question)).toMatchSnapshot();
  });

  it('toggles view and sets question when question is unanswered', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CategoryGameQuestions {...mockProps} />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const question = wrapper.find('div[data-test="game-question-0"]');
    const clickDiv = question.children().find('div');
    clickDiv.simulate('click');
    expect(mockProps.toggleView).toHaveBeenCalledTimes(1);
    expect(mockProps.setQuestion).toHaveBeenCalledTimes(1);
  });

  it('does not show question when answered question is clicked', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CategoryGameQuestions {...mockProps} />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const question = wrapper.find('div[data-test="game-question-1"]');
    const clickDiv = question.children().find('div');
    clickDiv.simulate('click');

    expect(mockProps.toggleView).toHaveBeenCalledTimes(0);
    expect(mockProps.setQuestion).toHaveBeenCalledTimes(0);
  });
});
