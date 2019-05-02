import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import PaginationStyled from '../styles/Paginated';

const Heading = ({
  game,
  title,
  nextLinkText = `Next`,
  nextLinkPath,
  prevLinkText = `Back`,
  prevLinkPath,
  hide = false,
}) => (
  <PaginationStyled breadcrumb>
    <h2>{title}</h2>
    <Link
      href={{
        pathname: prevLinkPath,
        query: prevLinkPath !== '/' ? { game } : {},
      }}
    >
      <a className="prev">
        <span>←</span>
        {prevLinkText}
      </a>
    </Link>
    <Link
      href={{
        pathname: nextLinkPath,
        query: { game },
      }}
    >
      <a className="next" aria-disabled={hide}>
        {nextLinkText}
        <span>→</span>
      </a>
    </Link>
  </PaginationStyled>
);
Heading.propTypes = {
  game: PropTypes.string.isRequired,
  title: PropTypes.string,
  nextLinkPath: PropTypes.string.isRequired,
  nextLinkText: PropTypes.string.isRequired,
  prevLinkPath: PropTypes.string.isRequired,
  prevLinkText: PropTypes.string.isRequired,
  hide: PropTypes.bool,
};

export default React.memo(Heading);
