import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import CategoryNames, {
  UPDATE_CATEGORY_MUTATION,
} from '../components/CategoryNames';
import { fakeGame } from '../lib/testUtils';

describe('<CategoryNames />', () => {
  it('renders edit categories form and matches snapshot', async () => {
    const { categories } = fakeGame();
    const wrapper = mount(
      <MockedProvider>
        <CategoryNames categories={categories} />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const form = wrapper.find('form[data-test="category-names-form"]');
    expect(toJSON(form)).toMatchSnapshot();
  });

  it('adds changed inputs to state', async function() {
    const { categories } = fakeGame();
    const wrapper = mount(
      <MockedProvider>
        <CategoryNames categories={categories} />
      </MockedProvider>
    );
    wrapper.find('input#cat-1').simulate('change', {
      target: { id: 'cat-1', value: 'An Updated Category Name' },
    });
    wrapper.update();
    const updatedCategories = JSON.parse(JSON.stringify(categories)); // deep clone
    updatedCategories[0].name = 'An Updated Category Name';
    expect(wrapper.find('CategoryNames').instance().state).toMatchObject({
      categories: updatedCategories,
      called: false,
    });
  });

  it('shows saved category names confirmation on submit', async () => {
    const { categories } = fakeGame();
    const mocks = [
      {
        request: {
          query: UPDATE_CATEGORY_MUTATION,
          variables: {
            categoryId: 'cat-1',
            categoryName: 'An Updated Category Name',
          },
        },
        result: {
          data: {
            updateCategory: {
              id: 'cat-1',
              name: 'An Updated Category Name',
              __typename: 'Category',
            },
          },
        },
      },
    ];

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <CategoryNames categories={categories} />
      </MockedProvider>
    );

    const form = wrapper.find('form[data-test="category-names-form"]');
    form.simulate('submit');

    await wait(0);
    wrapper.update();

    const uiConfirm = wrapper.find(
      'span[data-test="category-names-save-confirmation"]'
    );
    expect(uiConfirm.props().hidden).toBeFalsy();
  });
});
