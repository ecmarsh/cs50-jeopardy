import styled from 'styled-components';

const WagerInputs = styled.fieldset`
  background-color: white;
  color: black;
  padding: 3rem;
  font-size: 2rem;
  min-width: 50rem;
  max-width: 60rem;
  margin: 0 auto;

  label {
    padding: 1rem 20%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      font-size: 0.8em;
      color: ${props => props.theme.grey};
    }
  }

  input {
    padding: 1rem;
    width: 8rem;
    font-size: 1.5rem;
    color: ${props => props.theme.darkGrey};

    &:focus {
      outline-color: ${props => props.theme.primaryDark};
    }
  }

  .disclaimer {
    color: ${props => props.theme.grey};
    font-size: italic;
    font-size: 0.9em;
    margin-top: 1rem;

    &.smaller {
      font-size: 0.8em;
    }
  }
`;

export default WagerInputs;
