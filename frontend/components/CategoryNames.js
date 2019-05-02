import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import * as R from 'ramda';
import formatRound from '../lib/formatRound';
import Error from './ErrorMessage';
import Form from './styles/Form';
import Button from './styles/Button';
import { TextMuted, Divider } from './styles/Utilities';

const UPDATE_CATEGORY_MUTATION = gql`
  mutation UPDATE_CATEGORY_MUTATION($categoryId: ID!, $categoryName: String) {
    updateCategory(id: $categoryId, name: $categoryName) {
      id
      name
    }
  }
`;

class CategoryNames extends Component {
  static propTypes = {
    categories: PropTypes.array.isRequired,
  };

  state = {
    categories: [],
    called: false,
  };

  componentDidMount() {
    const { categories } = this.props;
    this.setState({ categories });
  }

  handleChange = e => {
    e.preventDefault();
    const { id, value } = e.target;
    const categories = [...this.state.categories];
    const idx = R.findIndex(R.propEq('id', id))(categories);
    categories[idx].name = value;
    categories[idx].updated = true; // flag to include in mutation
    this.setState({ categories });
  };

  handleSubmit = (e, updateCategoryMutation) => {
    // Stop default form submission
    e.preventDefault();
    // Get list of changed categories to update
    const updatedCategories = R.filter(R.has('updated'), this.state.categories);
    // Update category mutation
    const doMutation = async category => {
      const { id, name } = category;
      const res = await updateCategoryMutation({
        variables: { categoryId: id, categoryName: name },
      });
    };
    // Invoke mutation on each updated category
    R.forEach(doMutation, updatedCategories);
    // Called to flash saved message
    this.setState({ called: true });

    setTimeout(this.flashUpdatedConfirmation, 2000);
  };

  flashUpdatedConfirmation = () => {
    this.setState({ called: false });
  };

  render() {
    const { categories, called } = this.state;
    return (
      <Mutation mutation={UPDATE_CATEGORY_MUTATION}>
        {(updateCategory, { loading, error }) => {
          return (
            <Form
              data-test="category-names-form"
              className="noBg"
              onSubmit={e => this.handleSubmit(e, updateCategory)}
            >
              <h2>Category Names</h2>
              <Error error={error} />
              <fieldset disabled={loading} aria-busy={loading}>
                {categories.map((category, i) => (
                  <div key={category.id}>
                    {i === 0 && <h4>{formatRound(1)}</h4>}
                    {i === 5 && <h4>{formatRound(2)}</h4>}
                    {i === 10 && <h4>{formatRound(3)}</h4>}
                    <label
                      htmlFor={`category-${i}`}
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                      }}
                    >
                      <TextMuted
                        style={{ textAlign: 'center', flexBasis: '25%' }}
                      >
                        CATEGORY {i + 1}:
                      </TextMuted>
                      <input
                        type="text"
                        name={`category-${i}`}
                        id={category.id}
                        value={category.name}
                        onChange={e => this.handleChange(e)}
                        style={{
                          flexBasis: '60%',
                          width: 'auto',
                        }}
                      />
                    </label>
                  </div>
                ))}
                <div style={{ margin: '0 auto' }}>
                  <TextMuted
                    data-test="category-names-save-confirmation"
                    hidden={!called}
                  >
                    Category Names Saved!
                  </TextMuted>
                  <Button
                    primary
                    type="submit"
                    style={{ margin: '1rem auto 2rem' }}
                  >
                    Save Category Names
                  </Button>
                  <Divider />
                  {this.props.children}
                </div>
              </fieldset>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default CategoryNames;
export { UPDATE_CATEGORY_MUTATION };
