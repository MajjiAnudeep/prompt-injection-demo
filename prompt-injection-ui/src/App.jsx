import { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { darkTheme, lightTheme } from './theme/theme';
import { LoginScreen, MainLayout } from './components';

/**
 * App
 *
 * Root component. Shows LoginScreen until a username is provided,
 * then switches to MainLayout with the 3-tab demo interface.
 * Username is stored in-memory (React state) — no persistence.
 */
export default function App() {
  const [username, setUsername] = useState(null);
  const [isDark, setIsDark] = useState(true);
 
  const handleLogin = (name) => setUsername(name);
  const handleLogout = () => setUsername(null);
  const toggleTheme = () => setIsDark((prev) => !prev);
 
  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <CssBaseline />
      {username ? (
        <MainLayout
          username={username}
          onLogout={handleLogout}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
    </ThemeProvider>
  );
}