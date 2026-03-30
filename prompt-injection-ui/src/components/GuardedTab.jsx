import { useState } from 'react';
import {
  Box,
  Typography,
  Alert,
  Chip,
  Tooltip,
} from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import {
  GUARDED_TAB_TITLE,
  GUARDED_TAB_DESCRIPTION,
  GUARDED_INFO,
  GUARDRAIL_LAYERS,
} from '../constants';
import { submitGuardedTriage } from '../services/api';
import BugSubmissionForm from './BugSubmissionForm';
import TriageResultDialog from './TriageResultDialog';

export default function GuardedTab({ username }) {
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
      const response = await submitGuardedTriage(username, bugDescription);
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
        {GUARDED_TAB_TITLE}
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, maxWidth: 650 }}>
        {GUARDED_TAB_DESCRIPTION}
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        {GUARDRAIL_LAYERS.map((layer) => (
          <Tooltip key={layer.id} title={layer.detail} arrow placement="top">
            <Chip
              icon={<ShieldIcon sx={{ fontSize: 16 }} />}
              label={`Layer ${layer.id}: ${layer.name}`}
              variant="outlined"
              color="success"
              size="small"
              sx={{ cursor: 'help', fontWeight: 500 }}
            />
          </Tooltip>
        ))}
      </Box>

      <Alert
        severity="info"
        sx={{ mb: 3, border: '1px solid rgba(144, 202, 249, 0.2)' }}
      >
        {GUARDED_INFO}
      </Alert>

      <BugSubmissionForm key={resetKey} onSubmit={handleSubmit} loading={loading} />

      <TriageResultDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        result={dialogResult}
        error={dialogError}
        isGuarded={true}
      />
    </Box>
  );
}