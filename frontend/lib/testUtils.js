import casual from 'casual';
import mappingArray from './mappingArray';

// seed it for repeatable random sequence
casual.seed(123);

const fakeQuestion = () => ({
  id: 'abc123',
  question: 'Time complexity of merge sort?',
  answer: 'n log n',
  user: {
    id: casual.uuid,
    name: 'User Name',
    __typename: 'User',
  },
  createdAt: '2019-02 - 26T19: 24: 16.000Z',
  game: {
    id: 'game123',
    name: 'GameForGeekz',
    user: {
      id: casual.uuid,
      __typename: 'User',
    },
    isPublic: casual.coin_flip,
    __typename: 'Game',
  },
  categoryQuestions: [
    {
      id: 'catQuest123',
      category: { id: 'cat123', __typename: 'Category' },
      __typename: '__CategoryQuestion',
    },
  ],
  __typename: 'Question',
});

const fakeUser = () => ({
  __typename: 'User',
  id: 'userABC123',
  name: casual.name,
  email: casual.email,
  permissions: ['USER'],
});

const fakeAdmin = () => ({
  __typename: 'User',
  id: 'adminABC123',
  name: casual.name,
  email: casual.email,
  permission: ['ADMIN', 'USER'],
  games: [],
});

const fakeCategoryQuestion = (id = 'catQuest123', difficulty = 1) => ({
  id,
  difficulty,
  isDouble: false,
  answered: casual.coin_flip,
  question: fakeQuestion(),
  category: { id: 'cat123', name: casual.word, __typename: 'Category' },
  game: { id: 'g@m3', name: 'Test Game', __typename: 'Game' },
  __typename: 'CategoryQuestion',
});

const fillCategoryQuestions = (n = 5) =>
  mappingArray(n).map(i => fakeCategoryQuestion(`catQuest-${i}`, i));

const fakeCategory = (id = 'cat123') => ({
  id,
  name: casual.word,
  game: { id: 'g@m3', name: 'Test Game' },
  categoryQuestions: fillCategoryQuestions(),
  __typename: 'Category',
});

const fillCategories = (n = 11) =>
  mappingArray(n).map(i => fakeCategory(`cat-${i}`));

const fakeTeam = id => ({
  __typename: 'Team',
  id: `t${id}`,
  name: `Team${id}`,
  score: 1000,
  game: { id: 'g@m3', name: 'Test Game' },
});

const fakeGameConfig = () => ({
  id: 'config123',
  hasDoubleJeopardy: false,
  hasRoundTimer: false,
  roundTime: 0,
  finalTime: 0,
  __typename: 'GameConfig',
});

const fakeGame = () => ({
  __typename: 'Game',
  id: 'g@m3',
  name: 'Test Game',
  createdAt: '2019-03 - 06T19: 12: 16.000Z',
  isPublic: casual.coin_flip,
  user: fakeUser(),
  teams: [fakeTeam(1), fakeTeam(2)],
  categories: fillCategories(),
  questions: [fakeQuestion()],
  config: fakeGameConfig(),
});

const fakeStudyGame = (id = 'SG123') => ({
  __typename: 'StudyGame',
  id,
  answeredQuestions: [fakeCategoryQuestion(), fakeCategoryQuestion()],
  score: 1000,
  game: fakeGame(),
  user: fakeUser(),
  createdAt: '2019-04 - 25T19: 10: 16.000Z',
});

const fakeGameSummary = () => ({
  questionsConnection: {
    aggregate: {
      count: casual.double + 1,
      __typename: 'aggregate',
    },
    __typename: 'questionsConnection',
  },
  categoryQuestionsConnection: {
    aggregate: {
      count: casual.double,
      __typename: 'aggregate',
    },
    __typename: 'categoryQuestionsConnection',
  },
});

// Fake LocalStorage
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = value.toString();
  }

  removeItem(key) {
    delete this.store[key];
  }
}

export {
  LocalStorageMock,
  fakeQuestion,
  fakeUser,
  fakeAdmin,
  fakeCategory,
  fakeCategoryQuestion,
  fakeTeam,
  fakeGame,
  fakeStudyGame,
  fakeGameSummary,
  fakeGameConfig,
};
