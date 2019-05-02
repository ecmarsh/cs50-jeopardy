import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { CURRENT_USER_QUERY } from './User';
import Signin from './Signin';
import { Alert } from './Views';

const SignInRequired = ({ children, ...props }) => (
  <Query query={CURRENT_USER_QUERY}>
    {({ data, loading }) => {
      if (loading) return <p>Loading...</p>;
      if (!data.me) {
        return (
          <Alert message="Please Sign In To Continue">
            <Signin />
          </Alert>
        );
      }
      // Return wrapped component if already logged in
      return children;
    }}
  </Query>
);

SignInRequired.propTypes = {
  children: PropTypes.element,
};

export default SignInRequired;
