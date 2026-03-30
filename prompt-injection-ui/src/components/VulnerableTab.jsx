import { useState } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {
  VULNERABLE_TAB_TITLE,
  VULNERABLE_TAB_DESCRIPTION,
  VULNERABLE_WARNING,
} from '../constants';
import { submitVulnerableTriage } from '../services/api';
import BugSubmissionForm from './BugSubmissionForm';
import TriageResultDialog from './TriageResultDialog';

export default function VulnerableTab({ username }) {
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogResult, setDialogResult] = useState(null);
  const [dialogError, setDialogError] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  const handleSubmit = async (bugDescription) => {
    setLoading(true);
    setDialogResult(null);
    setDialogError(null);
    try {
      const response = await submitVulnerableTriage(username, bugDescription);
      setDialogResult(response);
      setResetKey(k => k + 1);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to reach the backend.';
      setDialogError(String(message));
    } finally {
      setLoading(false);
      setDialogOpen(true);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {VULNERABLE_TAB_TITLE}
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, maxWidth: 650 }}>
        {VULNERABLE_TAB_DESCRIPTION}
      </Typography>

      <Alert
        severity="warning"
        icon={<WarningAmberIcon />}
        sx={{ mb: 3, border: '1px solid rgba(255, 167, 38, 0.3)' }}
      >
        {VULNERABLE_WARNING}
      </Alert>

      <BugSubmissionForm key={resetKey} onSubmit={handleSubmit} loading={loading} />

      <TriageResultDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        result={dialogResult}
        error={dialogError}
        isGuarded={false}
      />
    </Box>
  );
}