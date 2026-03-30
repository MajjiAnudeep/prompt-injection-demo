import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BugReportIcon from '@mui/icons-material/BugReport';
import {
  LOGIN_TITLE,
  LOGIN_SUBTITLE,
  LOGIN_PLACEHOLDER,
  LOGIN_BUTTON_TEXT,
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
} from '../constants';

/**
 * LoginScreen
 *
 * Simple mock login — collects a username that serves as
 * both sessionId (for chat memory) and reporterName (for triage).
 * No authentication — purely for demo identity.
 */
export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const trimmed = username.trim();
    if (trimmed.length < USERNAME_MIN_LENGTH) {
      setError(`Name must be at least ${USERNAME_MIN_LENGTH} characters.`);
      return;
    }
    setError('');
    onLogin(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 20% 50%, #112240 0%, #0a1929 70%)',
        px: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 460,
          width: '100%',
          border: '1px solid rgba(144, 202, 249, 0.12)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Logo / Icon */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <BugReportIcon sx={{ fontSize: 52, color: 'secondary.main', mb: 1 }} />
            <Typography variant="h5" gutterBottom>
              {LOGIN_TITLE}
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
              {LOGIN_SUBTITLE}
            </Typography>
          </Box>

          {/* Username input */}
          <TextField
            fullWidth
            label="Your Name"
            placeholder={LOGIN_PLACEHOLDER}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            error={!!error}
            helperText={error}
            inputProps={{ maxLength: USERNAME_MAX_LENGTH }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          {/* Submit */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={username.trim().length < USERNAME_MIN_LENGTH}
          >
            {LOGIN_BUTTON_TEXT}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}