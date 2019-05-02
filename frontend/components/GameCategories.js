import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { useTrail, animated, config } from 'react-spring';
import Error from './ErrorMessage';
import { CATEGORIES_QUERY } from './CategoriesLoad';
import { categoriesPerPage } from '../config';
import Canvas from './styles/Board';

const GameCategories = ({ gameName, round, children }) => {
  const numberOfTrailItems = round === 3 ? 1 : categoriesPerPage;
  const width = round === 3 ? '100%' : '19.2%';
  const trails = useTrail(numberOfTrailItems, {
    config: { ...config.default },
    width,
    maxWidth: width,
    opacity: 1,
    transform: `translate3d(0, 0, 0)`,
    from: {
      opacity: 0,
      transform:
        round !== 3 ? `translate3d(0, 10% , 0)` : `translate3d(0, 0, 0)`,
    },
  });
  return (
    <Query
      query={CATEGORIES_QUERY}
      variables={{
        gameName: gameName,
        first: categoriesPerPage,
        skip: categoriesPerPage * (round - 1),
      }}
    >
      {({ data: { categories }, loading, error }) => {
        if (loading) return <div style={{ width }} />;
        if (error) return <Error error={error} />;
        return (
          <Canvas>
            {trails.map((trailProps, i) => (
              <animated.div
                key={`<${categories[i].id}>`}
                className={`category-wrapper`}
                style={trailProps}
              >
                {children({ category: categories[i] })}
              </animated.div>
            ))}
          </Canvas>
        );
      }}
    </Query>
  );
};
GameCategories.propTypes = {
  gameName: PropTypes.string.isRequired,
  round: PropTypes.number,
};

export default GameCategories;
