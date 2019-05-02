import styled from 'styled-components';

const FormWithOptions = styled.form`
  text-align: left;
  font-size: 1.8rem;
  width: 50rem;
  margin: 0 auto;
  padding: 0 20%;
  @media screen and (min-width: 800px) {
    padding-left: 35%;
  }

  fieldset {
    padding: 1rem;
    border: none;
  }

  input {
    padding: 0.5rem;
    font-size: 1.2rem;
    margin: 0.5rem 0.5rem 0.5rem 1rem;
    width: 3.5rem;
    text-align: center;
  }

  select {
    padding: 0.5rem;
    font-size: 1.4rem;
    width: 30rem;
  }

  .roundTimer {
    &__options {
      padding-left: 5rem;
      padding-top: 1rem;
      span {
        font-size: 0.7em;
      }
    }
  }

  .config__cta {
    padding: 0 20% 0 15%;
    .saved-confirmation {
      font-size: 1.4rem;
      margin-top: 1rem;
      color: ${props => props.theme.primary};
    }
    button {
      padding: 1rem 2rem;
      height: 100%;
      background: ${props => props.theme.lightGrey};
    }
  }
`;

export default FormWithOptions;
