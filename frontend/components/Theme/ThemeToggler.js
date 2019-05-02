import React from 'react';
import ThemeContext from './ThemeContext';
import Button from '../styles/Button';

const ThemeToggler = props => (
  <ThemeContext.Consumer>
    {({ name, toggleTheme }) => (
      <div className="current-theme">
        <Button tertiary {...props} onClick={() => toggleTheme()}>
          {props.buttonTxt || (
            <span>Use {name === 'CS50' ? 'Classic' : 'CS50'} theme</span>
          )}
        </Button>
      </div>
    )}
  </ThemeContext.Consumer>
);

export default ThemeToggler;
