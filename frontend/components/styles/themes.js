import { importedFont } from '../../config';

const globals = {
  lightGrey: '#ebebeb',
  grey: '#93a1ad',
  darkGrey: '#444444',
  red: '#a51c30',
  green: '#4fa744',
  alert: '#7a5909',
  gold: '#ffdb6d',
  alertBg: '#fff1c6',
  maxWidth: '1440px',
  maxHeight: '100vh',
  fontPrimary: `${importedFont}, -apple-system, BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol`,
  fontDisplay: `${importedFont}, sans-serif`,
  bs: '0 1px 1rem rgba(0,0,0,0.2)',
};

export const cs50Theme = {
  name: 'CS50',
  black: '#000000',
  white: '#FFFFFF',
  primary: '#a51c30',
  primaryOffset: '#640411',
  primaryDark: '#731422',
  secondary: '#B6B6B6',
  tertiary: '#B6B6B6',
  ...globals,
};

export const classicTheme = {
  name: 'Classic',
  classic: 1,
  black: '#121419',
  white: '#FFFFFF',
  primary: '#3259c8',
  primaryOffset: '#0000D0',
  primaryDark: '#011793',
  secondary: '#6a42ff',
  tertiary: '#b73b74',
  ...globals,
};
