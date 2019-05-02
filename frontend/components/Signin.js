import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Link from 'next/link';
import { CURRENT_USER_QUERY } from './User';
import Error from './ErrorMessage';
import Form, { Extension } from './styles/Form';
import Button from './styles/Button';
import { TextMuted } from './styles/Utilities';
import { isMailEnabled } from '../config';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`;

function Signin({ redirectPath = false }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [path, setPath] = useState('');

  const clearForm = () => {
    setEmail('');
    setPassword('');
  };

  useEffect(() => {
    setPath(window.location.pathname);
  }, [setPath]);

  return (
    <Mutation
      mutation={SIGNIN_MUTATION}
      variables={{ email, password }}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]} // log user in
    >
      {(signin, { loading, error }) => (
        <Form
          method="POST" // avoid passing psswd as param
          className={path === '/signin' ? 'noBg' : ''}
          onSubmit={async e => {
            e.preventDefault();
            const res = await signin();
            clearForm();
            Router.push({
              pathname: redirectPath ? `/${redirectPath}` : `/`,
            });
            return;
          }}
        >
          <Error error={error} />
          <h2>Sign In</h2>
          <fieldset disabled={loading} aria-busy={loading}>
            <label htmlFor="email">
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                required
                aria-required
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoFocus
              />
              <TextMuted>Email</TextMuted>
            </label>
            <label htmlFor="password">
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                required
                aria-required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <TextMuted>Password</TextMuted>
            </label>
            <Button type="submit" primary className="block">
              Sign In
            </Button>

            <Extension>
              <Link
                href={{
                  pathname: 'signup',
                }}
              >
                <Button tertiary>Create Account</Button>
              </Link>
              {isMailEnabled && (
                <Link
                  href={{
                    pathname: 'reset-request',
                  }}
                >
                  <Button tertiary>Reset Password</Button>
                </Link>
              )}
            </Extension>
          </fieldset>
        </Form>
      )}
    </Mutation>
  );
}
Signin.propTypes = {
  redirectPath: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

export default Signin;
