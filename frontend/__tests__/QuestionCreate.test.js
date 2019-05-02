import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import CreateQuestion, {
  CREATE_QUESTION_MUTATION,
} from '../components/QuestionCreate';
import { GAMES_QUERY } from '../components/GamesList';
import { GAME_SUMMARY_QUERY } from '../components/GameSummary';
import Router from 'next/router';
import { fakeQuestion, fakeGameSummary, fakeGame } from '../lib/testUtils';

describe('<QuestionCreate/>', () => {
  it('renders the question submission form', async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateQuestion gameName="fakeGame" />
      </MockedProvider>
    );
    const form = wrapper.find('form[data-test="create-question-form"]');
    expect(toJSON(form)).toMatchSnapshot();
  });

  it('updates state on input', async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateQuestion gameName="fakeGame" />
      </MockedProvider>
    );
    wrapper.find('#question').simulate('change', {
      target: { value: 'Test question', name: 'question' },
    });
    wrapper.find('#answer').simulate('change', {
      target: { value: 'Test answer', name: 'answer' },
    });
    expect(wrapper.find('CreateQuestion').instance().state).toMatchObject({
      question: 'Test question',
      answer: 'Test answer',
      gameName: 'fakeGame',
    });
  });

  it('shows game options when game is not provided', async () => {
    const question = fakeQuestion();
    // Imitate games list mock
    const gamesMock = {
      request: {
        query: GAMES_QUERY,
      },
      result: {
        data: {
          games: [question.game],
        },
      },
    };
    const wrapper = mount(
      <MockedProvider mocks={[gamesMock]}>
        <CreateQuestion />
      </MockedProvider>
    );
    expect(wrapper.exists('GameOptions')).toEqual(true);
  });

  it('creates question when form is submitted', async () => {
    const question = fakeQuestion();
    const gameSummary = fakeGameSummary();
    const otherGame = fakeGame();

    const mocks = [
      {
        request: {
          query: CREATE_QUESTION_MUTATION,
          variables: {
            question: question.question,
            answer: question.answer,
            gameName: question.game.name,
          },
        },
        result: {
          data: {
            createQuestion: {
              ...question,
              __typename: 'Question',
            },
          },
        },
      },
      // SELECT OPTIONS QUERY
      {
        request: {
          query: GAMES_QUERY,
        },
        result: {
          data: {
            games: [question.game, { ...otherGame, isPublic: true }],
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
    ];

    const wrapper = mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CreateQuestion />
      </MockedProvider>
    );
    wrapper.find('#question').simulate('change', {
      target: { value: question.question, name: 'question' },
    });
    wrapper.find('#answer').simulate('change', {
      target: { value: question.answer, name: 'answer' },
    });
    // Simulate setting game select (not mounted)
    wrapper.find('CreateQuestion').setState({ gameName: question.game.name });

    const expectedState = {
      question: question.question,
      answer: question.answer,
      gameName: question.game.name,
    };
    expect(wrapper.find('CreateQuestion').instance().state).toMatchObject(
      expectedState
    );
    // Mock router
    Router.router = { push: jest.fn() };

    wrapper.find('form[data-test="create-question-form"]').simulate('submit');
    // Pop route change off stack
    await wait(50);

    expect(Router.router.push).toHaveBeenCalled();

    const confirmationRoute = {
      pathname: '/thank-you',
      query: { id: question.id },
    };
    expect(Router.router.push).toHaveBeenCalledWith(confirmationRoute);
  });
});
