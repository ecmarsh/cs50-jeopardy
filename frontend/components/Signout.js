import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import { CURRENT_USER_QUERY } from './User';
import Button from './styles/Button';

const SIGN_OUT_MUTATION = gql`
  mutation SIGN_OUT_MUTATION {
    signout {
      message
    }
  }
`;
const Signout = props => (
  <Mutation
    mutation={SIGN_OUT_MUTATION}
    refetchQueries={[{ query: CURRENT_USER_QUERY }]}
  >
    {signout => (
      <Button
        tertiary
        onClick={() => {
          signout();
          Router.push({
            pathname: '/signin',
          });
        }}
      >
        Sign Out
      </Button>
    )}
  </Mutation>
);

export default Signout;
