import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { categoriesPerPage } from '../config';
import CategoryQuestions from './CategoryQuestions';
import { Heading } from './Views';
import Pagination from './Pagination';
import Error from './ErrorMessage';
import Main from './styles/Main';
import { Divider } from './styles/Utilities';

const CATEGORIES_QUERY = gql`
  query CATEGORIES_QUERY($gameName: String, $first: Int, $skip: Int) {
    categories(
      where: { game: { name: $gameName } }
      first: $first
      skip: $skip
    ) {
      id
      name
    }
  }
`;

class LoadCategories extends Component {
  state = {};

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { game, round, headingProps } = this.props;
    return (
      <Query
        query={CATEGORIES_QUERY}
        variables={{
          gameName: game,
          first: categoriesPerPage,
          skip: categoriesPerPage * (round - 1),
        }}
      >
        {({ data, loading, error }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <Error error={error} />;
          if (!data.categories) {
            return <Heading game={game} {...headingProps} />;
          }
          return (
            <Main>
              <Heading game={game} {...headingProps} />
              <Divider style={{ margin: '0 auto' }} />
              <Pagination gameName={game} round={round} />
              <div className="canvas">
                {data.categories.map(category => (
                  <div
                    key={'category' + category.id}
                    className="column-wrapper"
                  >
                    <ul>
                      <li>{category.name}</li>
                      <CategoryQuestions
                        categoryId={category.id}
                        gameName={game}
                        round={round}
                      />
                    </ul>
                  </div>
                ))}
              </div>
            </Main>
          );
        }}
      </Query>
    );
  }
}

export default LoadCategories;
export { CATEGORIES_QUERY };
