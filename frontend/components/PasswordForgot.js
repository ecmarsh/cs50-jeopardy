import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import Form from './styles/Form';
import Button from './styles/Button';
import { TextMuted } from './styles/Utilities';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;

class RequestReset extends Component {
  state = {
    email: '',
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { email } = this.state;
    return (
      <Mutation mutation={REQUEST_RESET_MUTATION} variables={this.state}>
        {(requestReset, { data, loading, error, called }) => (
          <Form
            method="POST"
            data-test="reset-form"
            onSubmit={async e => {
              e.preventDefault();
              const res = await requestReset();
            }}
          >
            <Error error={error} />
            {!error && !loading && called && (
              <p>Check your email for a reset link!</p>
            )}
            <h2>Password Reset</h2>
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="email-2">
                <input
                  type="email"
                  name="email"
                  id="email-2"
                  placeholder="Account Email"
                  required
                  value={email}
                  onChange={this.handleChange}
                />
                <TextMuted>Account Email</TextMuted>
              </label>
              <Button secondary type="submit">
                Request Reset
              </Button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default RequestReset;
export { REQUEST_RESET_MUTATION };
