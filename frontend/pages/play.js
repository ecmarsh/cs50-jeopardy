import SignInRequired from '../components/SignInRequired';
import Game from '../components/GameContainer';

const PlayGame = ({ query }) => (
  <SignInRequired>
    <Game gameName={query.game} round={parseFloat(query.round) || 1} />
  </SignInRequired>
);

export default PlayGame;
