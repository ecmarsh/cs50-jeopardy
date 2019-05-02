import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import Button from './styles/Button';

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation updatePermissions($permissions: [Permission], $userId: ID!) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      permissions
      name
      email
    }
  }
`;

class UsersPermissions extends Component {
  state = {
    permissions: this.props.user.permissions,
  };

  handlePermissionChange = e => {
    const checkbox = e.target;
    // shallow copy of current permissions
    let updatedPermissions = this.state.permissions;
    // add or remove permission
    if (checkbox.checked) {
      updatedPermissions.push(checkbox.value); // add it
    } else {
      updatedPermissions = updatedPermissions.filter(
        permission => permission !== checkbox.value // remove it if they had it
      );
    }
    this.setState({ permissions: updatedPermissions });
  };

  render() {
    const { index, allPermissions, user } = this.props;
    const { id, name, email, permissions } = user;
    return (
      <Mutation
        mutation={UPDATE_PERMISSIONS_MUTATION}
        variables={{
          permissions: this.state.permissions,
          userId: id,
        }}
      >
        {(updatePermissions, { loading, error }) => {
          error && (
            <tr>
              <td colSpan="8">
                <Error error={error} />
              </td>
            </tr>
          );
          return (
            <tr>
              <td>{index}</td>
              <td>{name}</td>
              <td>{email}</td>
              {allPermissions.map(permissionOption => (
                <td key={'tabledata' + id}>
                  <label htmlFor={`${id}-permission-${permissionOption}`}>
                    <input
                      checked={this.state.permissions.includes(
                        permissionOption
                      )}
                      name={`${id}-permission-${permissionOption}`}
                      type="checkbox"
                      value={permissionOption}
                      onChange={this.handlePermissionChange}
                    />
                  </label>
                </td>
              ))}
              <td>
                <Button
                  secondary
                  disabled={loading}
                  onClick={updatePermissions}
                >
                  Updat{loading ? 'ing' : 'e'}
                </Button>
              </td>
            </tr>
          );
        }}
      </Mutation>
    );
  }
}

UsersPermissions.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    id: PropTypes.string,
    permissions: PropTypes.array,
  }).isRequired,
  index: PropTypes.number,
  allPermissions: PropTypes.array.isRequired,
};

export default UsersPermissions;
