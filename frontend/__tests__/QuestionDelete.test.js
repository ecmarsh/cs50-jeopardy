import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import DeleteQuestion, {
  DELETE_QUESTION_MUTATION,
} from '../components/QuestionDelete';
import { GAME_SUMMARY_QUERY } from '../components/GameSummary';
import { GAME_QUESTIONS_QUERY } from '../components/QuestionsList';
import { fakeQuestion, fakeGameSummary } from '../lib/testUtils';

// Mock user confirming question delete
const confirmYes = jest.fn().mockResolvedValue(() => true);
global.confirm = confirmYes;

describe('<QuestionDelete/>', () => {
  const question = fakeQuestion();
  const gameSummary = fakeGameSummary();

  const mocks = [
    {
      request: {
        query: DELETE_QUESTION_MUTATION,
        variables: {
          id: question.id,
        },
      },
      result: {
        data: {
          deleteQuestion: {
            id: question.id,
            categoryQuestions: [],
            __typename: 'Question',
          },
        },
      },
    },
    // REFETCH QUERY
    {
      request: {
        query: GAME_SUMMARY_QUERY,
        variables: { gameName: question.game.name },
      },
      result: {
        data: gameSummary,
      },
    },
    // QUESTIONS LIST TO DELETE FROM
    {
      request: {
        query: GAME_QUESTIONS_QUERY,
        variables: { gameName: question.game.name },
      },
      result: {
        data: {
          questions: [question],
        },
      },
    },
  ];

  const wrapper = mount(
    <MockedProvider mocks={mocks} addTypename={false}>
      <DeleteQuestion
        gameName={question.game.name}
        questionId={question.id}
        categoryQuestionsProp={[]}
      />
    </MockedProvider>
  );

  it('renders the delete button and matches snapshot', async () => {
    const deleteButton = wrapper.find('Button');
    expect(toJSON(deleteButton)).toMatchSnapshot();
  });

  it('calls mutation and deletes the question', async () => {
    const apolloClient = wrapper.find('ApolloProvider').props().client;
    const res = await apolloClient.query({
      query: GAME_QUESTIONS_QUERY,
      variables: { gameName: question.game.name },
    });
    // Should contain question before deleting
    expect(res.data.questions).toHaveLength(1);
    expect(res.data.questions[0].id).toBe(question.id);

    // Simulate delete
    wrapper.find('button').simulate('click');
    // Confirmation message
    expect(window.confirm).toHaveBeenCalled();

    // Do mutation
    await wait(0);

    // Check that question doesn't exist anymore
    const res2 = await apolloClient.query({
      query: GAME_QUESTIONS_QUERY,
      variables: { gameName: question.game.name },
    });
    expect(res2.data.questions).toHaveLength(0);
  });
});
