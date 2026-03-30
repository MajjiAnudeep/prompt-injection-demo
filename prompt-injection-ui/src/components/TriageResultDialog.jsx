import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Chip,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { SEVERITY_COLORS, TEAM_LABELS } from '../constants';

/**
 * TriageResultDialog
 *
 * Modal that displays the result of a triage submission.
 * Shows either a success result (BugTriageResponse) or an error message.
 *
 * @param {boolean} open
 * @param {Function} onClose
 * @param {Object|null} result - BugTriageResponse on success
 * @param {string|null} error - error message on failure
 * @param {boolean} isGuarded - which endpoint was used
 */
export default function TriageResultDialog({ open, onClose, result, error, isGuarded = false }) {
  if (!open) return null;

  const isError = !!error;
  const severityColor = result ? (SEVERITY_COLORS[result.severity] || SEVERITY_COLORS.TBD) : null;
  const isBlocked = result?.rawAiResponse?.includes('[BLOCKED') || result?.rawAiResponse?.includes('[FLAGGED');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          border: isError
            ? '1px solid rgba(239, 83, 80, 0.4)'
            : isBlocked
              ? '1px solid rgba(102, 187, 106, 0.4)'
              : '1px solid rgba(144, 202, 249, 0.15)',
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {isError ? (
          <>
            <ErrorOutlineIcon color="error" />
            <Typography variant="h6">
              {isGuarded ? 'Guardrail Triggered' : 'Triage Failed'}
            </Typography>
          </>
        ) : (
          <>
            <CheckCircleOutlineIcon color={isBlocked ? 'success' : 'primary'} />
            <Typography variant="h6">Triage Result</Typography>
          </>
        )}
      </DialogTitle>

      <DialogContent dividers>
        {isError ? (
          <Alert severity={isGuarded ? 'success' : 'error'} sx={{ whiteSpace: 'pre-wrap' }}>
            {error}
          </Alert>
        ) : result && (
          <Box>
            {/* Severity + Blame chips */}
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
              <Chip
                label={`Severity: ${result.severity}`}
                sx={{
                  backgroundColor: severityColor,
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
              />
              <Chip
                label={`Blame: ${TEAM_LABELS[result.assignedBlame] || result.assignedBlame}`}
                variant="outlined"
                sx={{ fontWeight: 600, fontSize: '0.85rem' }}
              />
              {isBlocked && (
                <Chip
                  label="BLOCKED / FLAGGED"
                  color="success"
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
              )}
            </Box>

            {/* Reporter */}
            <Typography variant="body2" sx={{ mb: 1 }}>
              Reporter: {result.reporterName}
            </Typography>

            {/* Bug Description */}
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
              {result.bugDescription}
            </Typography>

            {/* Raw AI Response — collapsible */}
            <Accordion
              disableGutters
              sx={{
                backgroundColor: 'rgba(0,0,0,0.2)',
                '&:before': { display: 'none' },
                border: '1px solid rgba(144, 202, 249, 0.08)',
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Raw AI Response
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {result.rawAiResponse}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained" size="small">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}