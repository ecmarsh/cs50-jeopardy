import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Link from 'next/link';
import formatRound from '../lib/formatRound';
import Error from './ErrorMessage';
import PaginationStyled from './styles/Paginated';
import { categoriesPerPage } from '../config';

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY($gameName: String) {
    categoriesConnection(where: { game: { name: $gameName } }) {
      aggregate {
        count
      }
    }
  }
`;

const Pagination = ({ gameName, round }) => {
  const labels = {
    prevPageLinkText: `Prev Round`,
    nextPageLinkText: `Next Round`,
    pathnameOfPage: `load`,
  };
  return (
    <Query query={PAGINATION_QUERY} variables={{ gameName: gameName }}>
      {({ data: { categoriesConnection }, loading, error }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <Error error={error} />;
        const totalPages = Math.ceil(
          categoriesConnection.aggregate.count / categoriesPerPage
        );
        return (
          <PaginationStyled data-test="pagination">
            <h4 data-test="pagination-round">{formatRound(round)}</h4>
            <Link
              prefetch
              href={{
                pathname: labels.pathnameOfPage,
                query: { game: gameName, round: round === 1 ? 1 : round - 1 },
              }}
            >
              <a className="prev" aria-disabled={round <= 1}>
                <span>←</span>
                {labels.prevPageLinkText}
              </a>
            </Link>
            <Link
              prefetch
              href={{
                pathname: labels.pathnameOfPage,
                query: { game: gameName, round: round + 1 },
              }}
            >
              <a className="next" aria-disabled={round >= totalPages}>
                {labels.nextPageLinkText}
                <span>→</span>
              </a>
            </Link>
          </PaginationStyled>
        );
      }}
    </Query>
  );
};
Pagination.propTypes = {
  gameName: PropTypes.string.isRequired,
  round: PropTypes.number.isRequired,
};

export default Pagination;
export { PAGINATION_QUERY };
