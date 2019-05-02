import GameCreate from '../components/GameCreate';
import SignInRequired from '../components/SignInRequired';

const GameCreatePage = props => (
  <div>
    <SignInRequired>
      <GameCreate />
    </SignInRequired>
  </div>
);

export default GameCreatePage;
