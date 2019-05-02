import GameSetup from '../components/GameSetup';
import SignInRequired from '../components/SignInRequired';
import OwnershipRequired from '../components/OwnershipRequired';

const GameSetupPage = ({ query }) => (
  <SignInRequired>
    <OwnershipRequired game={query.game}>
      <GameSetup gameName={query.game} />
    </OwnershipRequired>
  </SignInRequired>
);

export default GameSetupPage;
