import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { TextEmph } from './styles/Utilities';
import Table from './styles/Table';

const GAME_SUMMARY_QUERY = gql`
  query GAME_SUMMARY_QUERY($gameName: String!) {
    questionsConnection(where: { game: { name: $gameName } }) {
      aggregate {
        count
      }
    }
    categoryQuestionsConnection(
      where: {
        game: { name: $gameName }
        question: { game: { name: $gameName } }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

const GameSummary = ({
  data: { questionsConnection, categoryQuestionsConnection },
}) => {
  const totalQuestionsInGame = 51;
  return (
    <Fragment>
      <TextEmph>Game Status</TextEmph>
      <Table strong>
        <tbody>
          <tr>
            <td>Submitted Questions:</td>
            <td>{questionsConnection.aggregate.count}</td>
          </tr>
          <tr>
            <td>Loaded Questions:</td>
            <td>
              {categoryQuestionsConnection.aggregate.count} <small> / </small>
              51
            </td>
          </tr>
          <tr>
            <td>Ready to Play:</td>
            <td>
              {categoryQuestionsConnection.aggregate.count ===
              totalQuestionsInGame
                ? `✅`
                : `🚫`}
            </td>
          </tr>
        </tbody>
      </Table>
    </Fragment>
  );
};

GameSummary.propTypes = {
  data: PropTypes.shape({
    categoryQuestionsConnection: PropTypes.object,
    questionsConnection: PropTypes.object,
  }).isRequired,
};

export default GameSummary;
export { GAME_SUMMARY_QUERY };
