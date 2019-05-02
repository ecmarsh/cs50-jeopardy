import React, { useState } from 'react';
import themes from './themes';
import ThemeContext from './ThemeContext';
import { ThemeProvider } from 'styled-components';

const Themed = ({ children }) => {
  const [theme, setTheme] = useState(themes.cs50Theme);

  const toggleTheme = () => {
    const otherTheme =
      theme === themes.cs50Theme ? themes.classicTheme : themes.cs50Theme;
    setTheme(otherTheme);
    return;
  };

  let { name } = theme;
  return (
    <ThemeContext.Provider value={{ name, toggleTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default Themed;
