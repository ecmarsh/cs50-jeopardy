import Question from '../components/Question';
import SignInRequired from '../components/SignInRequired';

const Detail = ({ query }) => (
  <div>
    <SignInRequired>
      <Question />
    </SignInRequired>
  </div>
);

export default Detail;
