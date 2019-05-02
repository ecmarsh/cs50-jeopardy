import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import NavLinks from '../components/Page/Nav';
import { CURRENT_USER_QUERY } from '../components/User';
import { MockedProvider } from 'react-apollo/test-utils';
import { fakeUser } from '../lib/testUtils';
import toTitleCase from '../lib/toTitleCase';

const notSignedInMock = {
  request: { query: CURRENT_USER_QUERY },
  result: { data: { me: null } },
};

const signedInMock = {
  request: { query: CURRENT_USER_QUERY },
  result: { data: { me: fakeUser() } },
};

describe('<Nav />', () => {
  it('renders nav according to if user and if permissions', async () => {
    const wrapper = mount(
      <MockedProvider mocks={[notSignedInMock]}>
        <NavLinks />
      </MockedProvider>
    );
    await wait(0);
    wrapper.update();
    const nav = wrapper.find('[data-test="nav"]');
    expect(toJSON(nav)).toMatchSnapshot();
  });

  it('shows extra nav links when user signed in', async () => {
    const wrapper = mount(
      <MockedProvider mocks={[signedInMock]}>
        <NavLinks />
      </MockedProvider>
    );
    await wait(0);
    wrapper.update();
    const nav = wrapper.find('[data-test="nav"]');
    expect(toJSON(nav)).toMatchSnapshot();
  });
});
