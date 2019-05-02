import QuestionUpdate from '../components/QuestionUpdate';
import SignInRequired from '../components/SignInRequired';

const QuestionUpdatePage = ({ query }) => (
  <div>
    <SignInRequired>
      <QuestionUpdate id={query.id} />
    </SignInRequired>
  </div>
);

export default QuestionUpdatePage;
