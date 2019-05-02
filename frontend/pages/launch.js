import GameLaunch from '../components/GameLaunch';
import SignInRequired from '../components/SignInRequired';
import OwnershipRequired from '../components/OwnershipRequired';

const GameLaunchPage = ({ query }) => (
  <SignInRequired>
    <OwnershipRequired game={query.game}>
      <GameLaunch gameName={query.game} />
    </OwnershipRequired>
  </SignInRequired>
);

export default GameLaunchPage;
