import React, { createContext, useContext, useState, useMemo } from "react";
import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#7E57C2",
    background: "#F7F7F7",
    surface: "#FFFFFF",
    text: "#000",
    disabled: "rgba(0,0,0,0.5)", 
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#B39DDB",
    background: "#121212",
    surface: "#1E1E1E",
    text: "#FFF",
    disabled: "rgba(255,255,255,0.4)", 
  },
};


const ThemeContext = createContext({
  isDarkTheme: false,
  toggleTheme: () => {},
  theme: lightTheme,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => setIsDarkTheme((prev) => !prev);

  const theme = useMemo(() => (isDarkTheme ? darkTheme : lightTheme), [isDarkTheme]);

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
