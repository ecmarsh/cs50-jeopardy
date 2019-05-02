import { mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import RequestReset, {
  REQUEST_RESET_MUTATION,
} from '../components/PasswordForgot';

const mock = {
  request: {
    query: REQUEST_RESET_MUTATION,
    variables: { email: 'test@test.com' },
  },
  result: {
    data: { requestReset: { message: 'success', __typename: 'Message' } },
  },
};

describe('Request Password Reset', () => {
  it('renders and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider>
        <RequestReset />
      </MockedProvider>
    );
    const resetForm = wrapper.find('form[data-test="reset-form"]');
    expect(toJSON(resetForm)).toMatchSnapshot();
  });
  it('calls the reset mutation', async () => {
    const wrapper = mount(
      <MockedProvider mocks={[mock]}>
        <RequestReset />
      </MockedProvider>
    );
    // simulate inputting an email
    wrapper.find('input').simulate('change', {
      target: { name: 'email', value: 'test@test.com' },
    });
    // simulate form submission
    wrapper.find('form').simulate('submit');
    await wait();
    wrapper.update();
    // expect a reset confirmation message
    expect(wrapper.find('p').text()).toContain(
      'Check your email for a reset link'
    );
  });
});
