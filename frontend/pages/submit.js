import QuestionCreate from '../components/QuestionCreate';
import SignInRequired from '../components/SignInRequired';

const QuestionSubmitPage = ({ query }) => (
  <div>
    <SignInRequired>
      <QuestionCreate gameName={query.game} round={query.round || 1} />
    </SignInRequired>
  </div>
);

export default QuestionSubmitPage;
