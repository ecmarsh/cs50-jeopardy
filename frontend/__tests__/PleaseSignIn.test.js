import { mount } from 'enzyme';
import wait from 'waait';
import SignInRequired from '../components/SignInRequired';
import { CURRENT_USER_QUERY } from '../components/User';
import { MockedProvider } from 'react-apollo/test-utils';
import { fakeUser } from '../lib/testUtils';

const notSignedInMock = {
  request: { query: CURRENT_USER_QUERY },
  result: { data: { me: null } },
};

const signedInMock = {
  request: { query: CURRENT_USER_QUERY },
  result: { data: { me: fakeUser() } },
};

const TestChildComponent = () => <div>test child</div>;

describe('Sign in Required', () => {
  it('renders sign in form and no children if no user', async () => {
    const wrapper = mount(
      <MockedProvider mocks={[notSignedInMock]}>
        <SignInRequired>
          <TestChildComponent />
        </SignInRequired>
      </MockedProvider>
    );
    await wait(0);
    wrapper.update();
    // shows login form w/ alert
    expect(wrapper.text()).toContain('Please Sign In');
    const Signin = wrapper.find('Signin');
    expect(Signin.exists()).toBe(true);
    // does not show children
    expect(wrapper.contains(<TestChildComponent />)).toBe(false);
  });

  it('renders the child when a user is signed in', async () => {
    const wrapper = mount(
      <MockedProvider mocks={[signedInMock]}>
        <SignInRequired>
          <TestChildComponent />
        </SignInRequired>
      </MockedProvider>
    );
    await wait(0); // wait for login result
    wrapper.update();
    expect(wrapper.contains(<TestChildComponent />)).toBe(true);
  });
});
