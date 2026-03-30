/**
 * App Constants
 */

export const APP_TITLE = 'TriageBot — Prompt Injection Demo';
export const APP_SUBTITLE = 'AI-Powered Bug Triage & Security Showcase';

// Login screen
export const LOGIN_TITLE = 'Welcome to TriageBot';
export const LOGIN_SUBTITLE = 'Enter your name to begin the demo. This will be used as your session ID and reporter name.';
export const LOGIN_PLACEHOLDER = 'e.g. Lakshmi SP (QA)';
export const LOGIN_BUTTON_TEXT = 'Enter Demo';
export const USERNAME_MIN_LENGTH = 2;
export const USERNAME_MAX_LENGTH = 50;

// Tab definitions — order matters (index-based)
export const TABS = [
  { label: 'Chat Integration', key: 'chat-integration' },
  { label: 'Vulnerable Triage', key: 'vulnerable' },
  { label: 'Guarded Triage', key: 'guarded' },
  { label: 'Tickets', key: 'tickets' },
];

// Chat Integration tab
export const CHAT_TAB_TITLE = 'Chat Integration';
export const CHAT_TAB_DESCRIPTION =
  'Ask the AI technical assistant any question. This demonstrates basic Spring AI + Gemini integration with chat memory.';
export const CHAT_INPUT_PLACEHOLDER = 'Ask a technical question...';
export const CHAT_DEFAULT_PROMPT = 'Explain how prompt injection works and how we can mitigate it.';

// Vulnerable tab
export const VULNERABLE_TAB_TITLE = 'Unguarded TriageBot';
export const VULNERABLE_TAB_DESCRIPTION =
  'Submit a bug report to the AI triage system — with NO guardrails. Try injecting malicious instructions in the bug description to manipulate the severity or blame assignment.';
export const VULNERABLE_WARNING =
  'This endpoint is intentionally vulnerable for demonstration purposes. Prompt injection attacks WILL succeed here.';

// Guarded tab
export const GUARDED_TAB_TITLE = 'Guarded TriageBot';
export const GUARDED_TAB_DESCRIPTION =
  'Same triage system, but with 4 layers of defense. Try the same injection attacks — most will be caught.';
export const GUARDRAIL_LAYERS = [
  { id: 1, name: 'Input Sanitization', detail: 'Regex-based pattern matching catches common injection phrases before they ever reach the AI' },
  { id: 2, name: 'Hardened System Prompt', detail: 'Explicit instructions telling the model to treat user input as untrusted data' },
  { id: 3, name: 'Output Validation', detail: 'Structural checks ensuring the AI response is valid JSON with exactly the expected fields and enum values' },
  { id: 4, name: 'Delimiter Isolation', detail: 'User input wrapped in ===BEGIN/END=== markers so the model distinguishes instructions from data' },
];
export const GUARDED_INFO =
  'Nothing is 100% safe. The goal is defense in depth — make attacks hard, expensive, and detectable.';

// Tickets tab
export const TICKETS_TAB_TITLE = 'Ticket History';
export const TICKETS_TAB_DESCRIPTION = 'Browse, inspect, and manage all triaged bug tickets.';
export const TICKETS_EMPTY_MESSAGE = 'No tickets yet. Submit a bug from the Vulnerable or Guarded tab to get started.';

// Bug submission form
export const BUG_DESCRIPTION_PLACEHOLDER = 'Describe the bug...';
export const BUG_DESCRIPTION_MAX_LENGTH = 2000;
export const SUBMIT_BUTTON_TEXT = 'Submit Bug Report';

// Severity colors (for result display)
export const SEVERITY_COLORS = {
  HIGHEST: '#d32f2f',
  HIGH: '#f57c00',
  MEDIUM: '#fbc02d',
  LOW: '#388e3c',
  TBD: '#757575',
};

// Team labels
export const TEAM_LABELS = {
  BACKEND: 'Backend',
  FRONTEND: 'Frontend',
  QA: 'QA',
  PBI: 'PBI',
  TBD: 'TBD',
};