import React, { PureComponent } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Link from 'next/link';
import { CURRENT_USER_QUERY } from './User';
import { withUser } from './User';
import Error from './ErrorMessage';
import Button from './styles/Button';
import { Alert } from './Views';
import Form, { Extension } from './styles/Form';
import { TextMuted } from './styles/Utilities';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $name: String!
    $email: String!
    $password: String!
    $access: String!
  ) {
    signup(email: $email, password: $password, name: $name, access: $access) {
      id
      name
      email
    }
  }
`;

const clearedState = {
  name: '',
  email: '',
  password: '',
  access: 'basic',
};
class Signup extends PureComponent {
  state = clearedState;

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { name, email, password, access } = this.state;
    if (this.props.me) {
      const message = `Looks like you are already a user! Please sign out first if you'd like to create another account.`;
      return <Alert message={message} />;
    }
    return (
      <Mutation
        mutation={SIGNUP_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signup, { loading, error }) => (
          <Form
            method="POST"
            onSubmit={async e => {
              e.preventDefault();
              const res = await signup();
              //this.setState(clearedState);
              const pathname = access === `basic` ? `/submit` : `/`;
              Router.push({ pathname });
            }}
          >
            <Error error={error} />
            <h2>Create Account</h2>
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="name">
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Name"
                  required
                  value={name}
                  minLength="2"
                  onChange={this.handleChange}
                />
                <TextMuted>Name</TextMuted>
              </label>
              <label htmlFor="email">
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={this.handleChange}
                  validate="true"
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
                  value={password}
                  onChange={this.handleChange}
                />
                <TextMuted>Password</TextMuted>
              </label>
              <label htmlFor="access">
                <select
                  name="access"
                  id="access"
                  required
                  defaultValue={access}
                  onChange={this.handleChange}
                  style={{ minHeight: '3.5rem', minWidth: '27rem' }}
                >
                  <option value="basic">Basic</option>
                  <option value="moderator">Moderator</option>
                </select>
                <TextMuted>Account Type</TextMuted>
              </label>
              <Extension>
                <div className="helper-text">
                  <ul>
                    <li>
                      <strong>Basic: </strong> Submit questions and play
                      published games.
                    </li>
                    <li>
                      <strong>Moderator: </strong> Basic access, plus game
                      creation.
                    </li>
                  </ul>
                </div>
              </Extension>
              <Button primary className="block" type="submit">
                Create Account
              </Button>
              <Extension>
                <Link
                  href={{
                    pathname: 'signin',
                  }}
                >
                  <Button tertiary>Have An Account? Sign In</Button>
                </Link>
              </Extension>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default withUser(Signup);
export { SIGNUP_MUTATION };
