import SignInRequired from '../components/SignInRequired';
import OwnershipRequired from '../components/OwnershipRequired';
import GameLoad from '../components/GameLoad';

const LoadGamePage = ({ query }) => (
  <SignInRequired>
    <OwnershipRequired game={query.game} round={query.round}>
      <GameLoad game={query.game} round={parseFloat(query.round) || 1} />
    </OwnershipRequired>
  </SignInRequired>
);

export default LoadGamePage;
