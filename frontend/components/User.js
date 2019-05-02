import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const CURRENT_USER_QUERY = gql`
  query {
    me {
      id
      email
      name
      permissions
    }
  }
`;

// User render prop
const User = props => (
  <Query {...props} query={CURRENT_USER_QUERY}>
    {payload => props.children(payload)}
  </Query>
);
User.propTypes = {
  children: PropTypes.func.isRequired,
};

// User hoc
function withUser(WrappedComponent) {
  function ComponentWithData(props) {
    return (
      <User>{({ data }) => <WrappedComponent me={data.me} {...props} />}</User>
    );
  }
  return ComponentWithData;
}

export default User;
export { CURRENT_USER_QUERY, withUser };
