import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import Router from 'next/router';
import { MockedProvider } from 'react-apollo/test-utils';
import Pagination, { PAGINATION_QUERY } from '../components/Pagination';
import { fakeGame } from '../lib/testUtils';

// Override prefetch error
Router.router = {
  push() {},
  prefetch() {},
};

// Use fakeGame as gamename variable
const { name } = fakeGame();

// Imitate pagination response
function makeMocksFor(length) {
  return [
    {
      request: {
        query: PAGINATION_QUERY,
        variables: {
          gameName: name,
        },
      },
      result: {
        data: {
          categoriesConnection: {
            aggregate: {
              count: length,
              __typename: 'count',
            },
            __typename: 'aggregate',
          },
        },
      },
    },
  ];
}

// Pagination tests
describe('Categories paginated', () => {
  it('displays a loading message', async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(1)}>
        <Pagination gameName={name} round={1} />
      </MockedProvider>
    );
    expect(wrapper.text()).toContain('Loading');
  });
  it('renders pagination for 11 categories', async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(11)}>
        <Pagination gameName={name} round={1} />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const pagination = wrapper.find('[data-test="pagination"]');
    expect(toJSON(pagination)).toMatchSnapshot();
  });
  it('renders the round based on paginated categories', async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(11)}>
        <Pagination gameName={name} round={3} />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const roundName = wrapper.find('[data-test="pagination-round"]');
    expect(roundName.text()).toContain('Final Jeopardy');
  });
  it('disables prev button on first round', async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(11)}>
        <Pagination gameName={name} round={1} />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(true);
    expect(wrapper.find('a.next').prop('aria-disabled')).toEqual(false);
  });
  it('disables next button on last round', async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(11)}>
        <Pagination gameName={name} round={3} />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(false);
    expect(wrapper.find('a.next').prop('aria-disabled')).toEqual(true);
  });
  it('enables all buttons on second round', async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(11)}>
        <Pagination gameName={name} round={2} />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(false);
    expect(wrapper.find('a.next').prop('aria-disabled')).toEqual(false);
  });
});
