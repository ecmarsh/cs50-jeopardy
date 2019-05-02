import PublicGames from '../components/GamesPublic';
import SignInRequired from '../components/SignInRequired';
import Main from '../components/styles/Main';

const PublicGamesPage = props => (
  <SignInRequired>
    <PublicGames />
  </SignInRequired>
);

export default PublicGamesPage;
