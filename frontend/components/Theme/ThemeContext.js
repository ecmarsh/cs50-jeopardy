import React from 'react';

const ThemeContext = React.createContext({
  name: 'CS50',
  toggleTheme: () => {},
});

export default ThemeContext;
