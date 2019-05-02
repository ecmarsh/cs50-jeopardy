import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Link from 'next/link';
import { format } from 'date-fns';
import { GAME_SUMMARY_QUERY } from './GameSummary';
import DeleteGame from './GameDelete';
import Error from './ErrorMessage';
import LeftColumn from './styles/List';
import StyledListItem from './styles/ListItem';
import { CloseSquareO } from './styles/icons';
import { TextOnOff } from './styles/Utilities';

const USER_GAMES_QUERY = gql`
  query USER_GAMES_QUERY {
    myGames {
      id
      name
      createdAt
      user {
        id
        name
      }
      questions {
        id
      }
    }
  }
`;

const GameStatus = ({ gameName }) => (
  <Query query={GAME_SUMMARY_QUERY} variables={{ gameName }}>
    {({ data: { categoryQuestionsConnection }, loading, error }) => {
      if (loading)
        return (
          <p>
            <small>Loading...</small>
          </p>
        );
      if (error)
        return (
          <p>
            <small>Questions Status</small>
          </p>
        );
      const loadedQuestions = categoryQuestionsConnection.aggregate.count;
      return (
        <p>
          <small>
            Question Status
            <TextOnOff textMuted={loadedQuestions < 51}>
              {loadedQuestions} / 51
            </TextOnOff>
          </small>
        </p>
      );
    }}
  </Query>
);
GameStatus.propTypes = {
  gameName: PropTypes.string.isRequired,
};

const UserGameListItem = ({ game: { id, name, createdAt } }) => (
  <StyledListItem key={id}>
    <Link
      href={{
        pathname: `/setup`,
        query: { game: name },
      }}
    >
      <a>
        <h4>{name}</h4>
        <GameStatus gameName={name} />
        <p>
          <small>{format(createdAt, 'MMMM DD, YYYY h:mm a')}</small>
        </p>
      </a>
    </Link>
    <DeleteGame gameName={name}>
      <CloseSquareO />
    </DeleteGame>
  </StyledListItem>
);
UserGameListItem.propTypes = {
  game: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired,
};

const Heading = ({ isSolo }) => {
  function HeaderInner() {
    return (
      <Fragment>
        <div className="heading">
          <h3>My Games</h3>
          <Link href="/start">
            <a>+ Create New Game</a>
          </Link>
          <hr />
        </div>
      </Fragment>
    );
  }
  if (isSolo) {
    return (
      <LeftColumn>
        <HeaderInner />
      </LeftColumn>
    );
  }
  return <HeaderInner />;
};
Heading.propTypes = {
  isSolo: PropTypes.bool,
};

const UserGamesList = () => (
  <Query query={USER_GAMES_QUERY}>
    {({ data: { myGames }, loading, error }) => {
      if (loading) return 'Loading...';
      if (!myGames) return <Heading isSolo />;
      return (
        <LeftColumn>
          <Heading />
          <Error error={error} />
          <ul>
            {myGames.map(game => (
              <UserGameListItem key={game.id} game={game} />
            ))}
          </ul>
        </LeftColumn>
      );
    }}
  </Query>
);

export default UserGamesList;
export { USER_GAMES_QUERY, UserGameListItem, GameStatus };
