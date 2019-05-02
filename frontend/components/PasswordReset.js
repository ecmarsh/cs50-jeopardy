import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';
import Router from 'next/router';
import Error from './ErrorMessage';
import Form from './styles/Form';
import Button from './styles/Button';
import { TextMuted } from './styles/Utilities';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      email
      name
    }
  }
`;

const clearedState = {
  password: '',
  confirmPassword: '',
};
class Reset extends Component {
  static propTypes = {
    resetToken: PropTypes.string.isRequired,
  };
  state = clearedState;

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { password, confirmPassword } = this.state;
    return (
      <Mutation
        mutation={RESET_MUTATION}
        variables={{
          resetToken: this.props.resetToken,
          password,
          confirmPassword,
        }}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(reset, { loading, error }) => (
          <Form
            method="POST"
            onSubmit={async e => {
              e.preventDefault();
              const res = await reset();
              this.setState(clearedState);
              Router.push({
                pathname: '/',
              });
            }}
          >
            <Error error={error} />
            <h2>Reset Password</h2>
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="password-3">
                <input
                  type="password"
                  name="password"
                  id="password-3"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={this.handleChange}
                />
                <TextMuted>Password</TextMuted>
              </label>
              <label htmlFor="confirmPassword">
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="Confirm password"
                  required
                  value={confirmPassword}
                  onChange={this.handleChange}
                />
                <TextMuted>Confirm</TextMuted>
              </label>
              <Button secondary type="submit">
                Reset
              </Button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default Reset;
