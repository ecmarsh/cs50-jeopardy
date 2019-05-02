import { mount } from 'enzyme';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import AddToCategory from '../components/CategoryQuestionAdd';
import { fakeQuestion, fakeCategoryQuestion } from '../lib/testUtils';

const catQ = fakeCategoryQuestion();
const question = fakeQuestion();

const sharedProps = {
  categoryQuestionId: catQ.id,
  categoryId: catQ.category.id,
  difficulty: catQ.difficulty,
  categoryName: catQ.category.name,
  gameName: catQ.game.name,
};

describe('Add Question To Category', () => {
  it('renders the question difficulty when empty', async () => {
    const emptyProps = {
      loaded: false,
      question: {},
      ...sharedProps,
    };
    const wrapper = mount(
      <MockedProvider>
        <AddToCategory {...emptyProps} />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.text()).toContain(catQ.difficulty);
  });
  it('renders the question when loaded', async () => {
    const loadedProps = {
      loaded: true,
      question: question,
      ...sharedProps,
    };
    const wrapper = mount(
      <MockedProvider>
        <AddToCategory {...loadedProps} />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.text()).toContain(catQ.question.question);
  });
});
