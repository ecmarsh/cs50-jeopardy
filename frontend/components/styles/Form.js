import styled, { keyframes, css } from 'styled-components';

const loading = keyframes`
  from {
    background-position: 0 0;
  }

  to {
    background-position: 100% 100%;
  }
`;

const Form = styled.form`
  background-image: linear-gradient(
    to top,
    ${props => props.theme.lightGrey} 5%,
    ${props => props.theme.white}
  );
  background: ${props => props.theme.white};
  border-radius: 1rem;
  padding: 4% 2rem 5%;
  box-shadow: ${props => props.theme.bs};

  :only-of-type {
    max-width: 60rem;
    margin: 0 auto;
  }

  &.noBg {
    margin-top: 4rem;
    box-shadow: -1px 3px 8px rgba(0, 0, 0, 0.2);
  }

  h2 {
    margin-bottom: 2rem;
    font-size: 2.5rem;
    color: ${props => props.theme.darkGrey};
  }
  fieldset {
    border: none;
    display: flex;
    flex-direction: column;
    align-items: center;

    &[disabled] {
      opacity: 0.5;
    }
    &::before {
      content: '';
      height: 8px;
      width: 60%;
      margin: 0 auto;
      border-radius: 10px;
      display: block;
      background-image: linear-gradient(
        to right,
        ${props => props.theme.white} 0%,
        ${props => props.theme.primary} 50%,
        ${props => props.theme.white} 100%
      );
    }
    &[aria-busy='true']::before {
      background-size: 50% auto;
      height: 8px;
      animation: ${loading} 0.7s linear infinite;
    }

    button {
      justify-self: center;
      margin: 4rem auto 0;
      font-size: 1.4rem;
    }
  }

  label {
    margin: 2rem auto;
    display: flex;
    flex-direction: column;
    align-items: baseline;
    width: 25rem;

    span {
      display: block;
      width: 25rem;
      margin-bottom: 0.3rem;
      padding-left: 1rem;
      font-size: 0.9em;
      text-align: left;
      color: ${props => props.theme.darkGrey};
      order: 0;
      transition: transform 0.3s cubic-bezier(0.18, 1.06, 0.78, 0.95);
    }

    textarea,
    input[type='text'],
    input[type='password'],
    input[type='number'],
    select,
    input[type='email'] {
      width: 25rem;
      padding: 1rem;
      letter-spacing: 0.5px;
      font-size: 1.4rem;
      border: 1px solid ${props => props.theme.lightGrey};
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 5px;
      order: 2;
      font-family: inherit;

      &[value=''] + span {
        transform: translateY(2rem);
        z-index: -1;
      }

      &.isBlank + span {
        transform: translateY(2rem);
        z-index: -1;
      }

      &:focus {
        outline: ${props => props.theme.grey} auto 2px;
        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.4);

        & + span {
          transform: translateY(-0.5rem);
          z-index: 1;
        }
      }
    }
  }
`;

const Extension = styled.div`
  display: flex;
  justify-content: space-between;
  min-width: 22rem;
  max-width: 30rem;
  margin: 0 auto;

  .helper-text {
    font-size: 1.2rem;
    text-align: left;
    transform: translateX(10%);
    color: ${props => props.theme.darkGrey};
  }
`;

export default Form;
export { Extension };
