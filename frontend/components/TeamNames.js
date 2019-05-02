import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Mutation } from 'react-apollo';
import { TextMuted } from './styles/Utilities';
import Error from './ErrorMessage';
import Button from './styles/Button';
import gql from 'graphql-tag';
import Form from './styles/Form';
import { SINGLE_GAME_QUERY } from './GameSetup';

const UPDATE_TEAM_NAMES_MUTATION = gql`
  mutation UPDATE_TEAM_NAMES_MUTATION(
    $team1Id: ID!
    $team2Id: ID!
    $team1Name: String!
    $team2Name: String!
  ) {
    updateTeamOne: updateTeam(id: $team1Id, name: $team1Name) {
      id
    }
    updateTeamTwo: updateTeam(id: $team2Id, name: $team2Name) {
      id
    }
  }
`;

class EditTeams extends Component {
  static propTypes = {
    teams: PropTypes.array.isRequired,
  };

  state = {
    team1Id: this.props.teams[0].id,
    team2Id: this.props.teams[1].id,
    team1Name: this.props.teams[0].name,
    team2Name: this.props.teams[1].name,
    called: false,
  };

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  updateTeamNames = async (e, updateTeamNamesMutation) => {
    e.preventDefault();
    const res = await updateTeamNamesMutation();
    this.setState({ called: true });
  };

  updateCache = (cache, payload) => {
    const query = {
      query: SINGLE_GAME_QUERY,
      variables: { name: this.props.gameName },
    };
    const {
      game: { teams, ...rest },
    } = cache.readQuery(query);
    const { team1Name, team2Name } = this.state;
    teams[0].name = team1Name;
    teams[1].name = team2Name;
    const data = { game: { teams, ...rest } };
    cache.writeQuery({ ...query, data });
  };

  render() {
    const teams = this.props.teams;
    const { called, ...variables } = this.state;
    return (
      <Mutation
        mutation={UPDATE_TEAM_NAMES_MUTATION}
        variables={{ ...variables }}
        update={this.updateCache}
      >
        {(updateTeams, { loading, error }) => (
          <PartialForm onSubmit={e => this.updateTeamNames(e, updateTeams)}>
            <Error error={error} />
            <fieldset
              style={{ border: 'none' }}
              disabled={loading}
              aria-busy={loading}
            >
              {teams.map((team, i) => (
                <label htmlFor={`team${i + 1}Name`} key={team.id}>
                  <TextMuted>{i === 0 ? '1st' : '2nd'} Team Name</TextMuted>
                  <input
                    type="text"
                    name={`team${i + 1}Name`}
                    value={this.state[`team${i + 1}Name`]}
                    required
                    autofill="false"
                    onKeyUp={() => {
                      if (called) {
                        this.setState({ called: false });
                      }
                    }}
                    onChange={this.handleChange}
                  />
                </label>
              ))}
            </fieldset>
            <br />
            <Button type="submit" tertiary>
              {!called && !loading && 'Save Team Names'}
              {!called && loading && 'Saving...'}
              {called && 'Saved Team Names'}
            </Button>
          </PartialForm>
        )}
      </Mutation>
    );
  }
}

const PartialForm = styled(Form)`
  background: transparent;
  box-shadow: none;
  padding: 1rem;
  fieldset[aria-busy='false']::before {
    background: transparent;
  }
  label {
    margin: 1rem auto;
  }
  button {
    padding: 1rem 2rem;
    height: 100%;
    background: ${props => props.theme.lightGrey};
  }
`;

export default EditTeams;
export { UPDATE_TEAM_NAMES_MUTATION };
