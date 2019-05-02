import { mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import Signup, { SIGNUP_MUTATION } from '../components/Signup';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeUser } from '../lib/testUtils';
import Router from 'next/router';

function mockInput(wrapper, name, value) {
  wrapper.find(`input[name="${name}"]`).simulate('change', {
    target: { name, value },
  });
}

const me = fakeUser();

const signupMock = {
  request: {
    query: SIGNUP_MUTATION,
    variables: {
      name: me.name,
      email: me.email,
      password: 'fakePassword',
      access: 'moderator',
    },
  },
  result: {
    data: {
      signup: {
        __typename: 'User',
        id: me.id,
        email: me.email,
        name: me.name,
      },
    },
  },
};

const refetchMock = {
  request: { query: CURRENT_USER_QUERY },
  result: {
    data: {
      me: {
        ...me,
        __typename: 'User',
      },
    },
  },
};

const noUserMock = {
  request: { query: CURRENT_USER_QUERY },
  result: {
    data: {
      me: {
        __typename: 'User',
        id: '',
        email: '',
        name: '',
        permissions: [],
      },
    },
  },
};

describe('<Signup />', () => {
  it('renders and matches snapshot', async () => {
    const wrapper = mount(
      // Pass empty user since it checks for that first
      <MockedProvider mocks={[noUserMock]}>
        <Signup />
      </MockedProvider>
    );
    expect(toJSON(wrapper.find('form'))).toMatchSnapshot();
  });

  it('calls signup mutation and logs user in', async () => {
    const wrapper = mount(
      <MockedProvider mocks={[signupMock, noUserMock, refetchMock]}>
        <Signup />
      </MockedProvider>
    );

    mockInput(wrapper, 'name', me.name);
    mockInput(wrapper, 'email', me.email);
    mockInput(wrapper, 'password', 'fakePassword');
    wrapper.find('select').simulate('change', {
      target: { name: 'access', value: 'moderator' },
    });

    // Mock router
    Router.router = { push: jest.fn() };

    // Submit the form
    wrapper.find('form').simulate('submit');
    // Wait for res
    await wait(50);
    wrapper.update();
    expect(Router.router.push).toHaveBeenCalled();
    expect(Router.router.push).toHaveBeenCalledWith({ pathname: '/' });

    wrapper.update();
    expect(wrapper.text()).toContain('Looks like you are already a user');

    let apolloClient = wrapper.find('ApolloProvider').props().client;
    const user = await apolloClient.query({ query: CURRENT_USER_QUERY });
    expect(user.data.me).toMatchObject(me);
  });
});
