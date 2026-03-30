import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import {
  CHAT_TAB_TITLE,
  CHAT_TAB_DESCRIPTION,
  CHAT_INPUT_PLACEHOLDER,
} from '../constants';
import { sendChatMessage, clearSession } from '../services/api';

/**
 * ChatIntegrationTab
 *
 * Showcases basic Spring AI + Gemini integration.
 * Sends messages via POST /api/chat-integration with sessionId for chat memory.
 */
export default function ChatIntegrationTab({ username }) {
  const [topic, setTopic] = useState('');
  const [conversation, setConversation] = useState([]); // { role: 'user'|'ai', text }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    const trimmed = topic.trim();
    if (!trimmed || loading) return;

    setConversation((prev) => [...prev, { role: 'user', text: trimmed }]);
    setTopic('');
    setLoading(true);
    setError('');

    try {
      const response = await sendChatMessage(trimmed, username);
      setConversation((prev) => [...prev, { role: 'ai', text: response }]);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to reach the backend.';
      setError(String(message));
    } finally {
      setLoading(false);
    }
  };

  const handleClearSession = async () => {
    try {
      await clearSession(username);
      setConversation([]);
      setError('');
    } catch (err) {
      setError('Failed to clear session.', err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="h5" gutterBottom>
            {CHAT_TAB_TITLE}
          </Typography>
          <Typography variant="body2" sx={{ maxWidth: 600 }}>
            {CHAT_TAB_DESCRIPTION}
          </Typography>
        </Box>
        <Tooltip title="Clear chat memory & reset model">
          <IconButton onClick={handleClearSession} color="secondary" sx={{ mt: 0.5 }}>
            <DeleteSweepIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Conversation history */}
      <Card sx={{ mb: 2, minHeight: 200, maxHeight: 450, overflow: 'auto' }}>
        <CardContent sx={{ p: 2 }}>
          {conversation.length === 0 && !loading && (
            <Typography variant="body2" sx={{ fontStyle: 'italic', textAlign: 'center', py: 4 }}>
              No messages yet. Ask a question to get started.
            </Typography>
          )}
          {conversation.map((msg, index) => (
            <Box
              key={index}
              sx={{
                mb: 1.5,
                p: 1.5,
                borderRadius: 2,
                backgroundColor:
                  msg.role === 'user'
                    ? 'rgba(144, 202, 249, 0.08)'
                    : 'rgba(255, 171, 64, 0.06)',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: msg.role === 'user' ? 'primary.main' : 'secondary.main',
                  display: 'block',
                  mb: 0.5,
                }}
              >
                {msg.role === 'user' ? username : 'AI Assistant'}
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {msg.text}
              </Typography>
            </Box>
          ))}
          {loading && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5 }}>
              <CircularProgress size={16} />
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                Thinking...
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Input */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder={CHAT_INPUT_PLACEHOLDER}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          autoFocus
        />
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={!topic.trim() || loading}
          sx={{ minWidth: 56 }}
        >
          <SendIcon fontSize="small" />
        </Button>
      </Box>
    </Box>
  );
}