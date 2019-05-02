import ReviewStudyGames from '../components/StudyGames';
import SignInRequired from '../components/SignInRequired';

const ReviewStudyGamesPage = ({ query }) => (
  <SignInRequired>
    <ReviewStudyGames game={query.game} />
  </SignInRequired>
);

export default ReviewStudyGamesPage;
