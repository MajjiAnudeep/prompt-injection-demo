import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import {
  BUG_DESCRIPTION_PLACEHOLDER,
  BUG_DESCRIPTION_MAX_LENGTH,
  SUBMIT_BUTTON_TEXT,
} from '../constants';

/**
 * BugSubmissionForm
 *
 * Reusable form for submitting bug descriptions.
 * Used by both VulnerableTab and GuardedTab.
 *
 * @param {Function} onSubmit - async (bugDescription) => void
 * @param {boolean} loading - Whether a submission is in progress
 */
export default function BugSubmissionForm({ onSubmit, loading = false }) {
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    const trimmed = description.trim();
    if (!trimmed || loading) return;
    onSubmit(trimmed);
  };

  const handleKeyDown = (e) => {
    // Ctrl+Enter to submit (since Enter creates newlines in multiline)
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  const charCount = description.length;
  const isOverLimit = charCount > BUG_DESCRIPTION_MAX_LENGTH;

  return (
    <Box>
      <TextField
        fullWidth
        multiline
        minRows={4}
        maxRows={10}
        label="Bug Description"
        placeholder={BUG_DESCRIPTION_PLACEHOLDER}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onKeyDown={handleKeyDown}
        error={isOverLimit}
        helperText={
          isOverLimit
            ? `Exceeds max length (${charCount}/${BUG_DESCRIPTION_MAX_LENGTH})`
            : `${charCount}/${BUG_DESCRIPTION_MAX_LENGTH} — Ctrl+Enter to submit`
        }
        disabled={loading}
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        size="large"
        onClick={handleSubmit}
        disabled={!description.trim() || isOverLimit || loading}
        endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
      >
        {loading ? 'Triaging...' : SUBMIT_BUTTON_TEXT}
      </Button>
    </Box>
  );
}