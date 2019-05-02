import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const AlertWrapper = styled.div`
  background-color: ${props => props.theme.white};
  border-radius: 2rem;
  box-shadow: ${props => props.theme.bs};
  padding: 2rem 0;

  &.no-bg {
    background: transparent;
    box-shadow: none;
    margin: 0 auto;
  }
  h4 {
    color: ${props => props.theme.alert};
    background: ${props => props.theme.alertBg};
    max-width: 60rem;
    margin: 2rem auto !important;
    padding: 1rem 2rem;
    border-radius: 6px;
    border: 1px solid ${props => props.theme.grey};
    font-weight: 400;
  }
`;

const Alert = ({ children, message, noBg = false }) => (
  <AlertWrapper className={noBg ? 'no-bg' : ''}>
    <h4>⚠️ {message}</h4>
    {children}
  </AlertWrapper>
);

Alert.propTypes = {
  message: PropTypes.string.isRequired,
  noBg: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
    PropTypes.array,
  ]),
};

export default Alert;
