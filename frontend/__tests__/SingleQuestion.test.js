import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import SubmittedQuestion, {
  SINGLE_QUESTION_QUERY,
} from '../components/QuestionConfirm';
import { MockedProvider } from 'react-apollo/test-utils';
import { fakeQuestion } from '../lib/testUtils';

describe('<SubmittedQuestion/>', () => {
  it('renders with submitted data', async () => {
    const mocks = [
      {
        request: {
          query: SINGLE_QUESTION_QUERY,
          variables: { id: '123' },
        },
        result: {
          data: {
            question: fakeQuestion(),
          },
        },
      },
    ];
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SubmittedQuestion id="123" />
      </MockedProvider>
    );
    // console.log(wrapper.debug());
    expect(wrapper.text()).toContain('Loading...');
    // wait for loading state to pass and update
    await wait();
    wrapper.update();
    //console.log(wrapper.debug());
    expect(toJSON(wrapper.find('h2'))).toMatchSnapshot();
    expect(toJSON(wrapper.find('span'))).toMatchSnapshot();
  });

  it('Errors with a not found question', async () => {
    const mocks = [
      {
        request: {
          query: SINGLE_QUESTION_QUERY,
          variables: { id: '123' },
        },
        result: {
          data: {
            question: null,
          },
        },
      },
    ];
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SubmittedQuestion id="123" />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const errMessage = wrapper.find('p');
    expect(wrapper.text()).toContain('Unable to load question');
    expect(toJSON(errMessage)).toMatchSnapshot();
  });
});
