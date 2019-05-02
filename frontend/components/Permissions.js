import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import UserRow from './PermissionsDetail';
import Error from './ErrorMessage';
import StyledTable from './styles/Table';
import Main from './styles/Main';

const allPermissions = [
  'ADMIN',
  'USER',
  'QUESTIONCREATE',
  'QUESTIONUPDATE',
  'PERMISSIONUPDATE',
];

const ALL_USERS_QUERY = gql`
  query {
    users {
      id
      name
      email
      permissions
    }
  }
`;

const Permissions = props => (
  <Query query={ALL_USERS_QUERY}>
    {({ data, loading, error }) => (
      <Main>
        <h2 style={{ padding: '2rem 0' }}>User Permissions</h2>
        <Error error={error} />
        <StyledTable>
          <thead>
            <tr>
              <th />
              <th>NAME</th>
              <th>EMAIL</th>
              {allPermissions.map((permissionOption, key) => (
                <th key={'permission' + key}>{permissionOption}</th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {data.users.map((user, i) => (
              <UserRow
                key={`userrow-i-${i + user.id}`}
                index={i + 1}
                user={user}
                allPermissions={allPermissions}
              />
            ))}
          </tbody>
        </StyledTable>
      </Main>
    )}
  </Query>
);

export default Permissions;
