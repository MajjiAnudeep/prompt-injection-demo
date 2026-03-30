# Prompt Injection Demo — Frontend

React frontend for the Prompt Injection Demo application. Provides a visual interface for the Spring Boot backend.

> All AI integration, guardrail logic, and data processing lives entirely in the backend. This UI is a visual layer only — it renders results, manages tabs, and forwards user input to the backend via REST API calls.

For setup instructions and the full demo walkthrough, see the [root README](../README.md) and the [backend README](../prompt-injection/README.md).

---

## Tech Stack

| | |
|---|---|
| Framework | React 18 |
| Build tool | Vite |
| UI library | Material UI (MUI) |
| HTTP client | Axios |
| Font | IBM Plex Sans |

---

## Getting Started

**Install dependencies** (only needed on first run or after pulling changes):
```bash
npm install
```

**Start the development server:**
```bash
npm run dev
```

The app will be available at `http://localhost:3000`. The backend must already be running on `http://localhost:8081` before opening the app.

Vite is configured to proxy all `/v1` and `/internal` requests to the backend, so no CORS configuration is needed.

**Build for production:**
```bash
npm run build
```

---

## Project Structure

```
prompt-injection-ui/
├── src/
│   ├── components/     # UI tabs and shared form components
│   ├── constants/      # API endpoint paths and UI labels
│   ├── services/       # Axios API client — all backend calls in one place
│   └── theme/          # MUI dark and light theme definitions
├── index.html
└── vite.config.js      # Dev server config with backend proxy
```

---

## Backend API

All calls are proxied to `http://localhost:8081`. The endpoints used by the UI are:

| Method | Path | Description |
|---|---|---|
| `POST` | `/v1/prompt-injection/api/chat-integration` | Send a chat message |
| `POST` | `/v1/prompt-injection/api/triage` | Submit a bug to the vulnerable endpoint |
| `POST` | `/v1/prompt-injection/api/guarded-triage` | Submit a bug to the guarded endpoint |
| `GET` | `/v1/prompt-injection/api/tickets` | Fetch all triaged tickets |
| `DELETE` | `/v1/prompt-injection/api/tickets` | Delete all tickets |
| `DELETE` | `/v1/prompt-injection/api/tickets/{bugUuid}` | Delete a single ticket |
| `GET` | `/internal/current-model` | Get the currently active AI model |
| `DELETE` | `/internal/clear-session/{sessionId}` | Clear chat history for a session |

All responses follow the `StandardResponse` envelope:
```json
{
  "success": true,
  "message": null,
  "data": {},
  "timestamp": "2025-01-01T00:00:00Z"
}
```

---

## Notes

- **Login is not authentication.** The login screen collects a display name used as the session ID for chat memory and as the reporter name on triage tickets. There is no user account or persistence.
- **Theme toggle** is available in the top bar and switches between dark and light mode.
- **Session reset** in the Chat Integration tab clears the conversation history on the backend for the current session.
- **Bug description limit** is 2000 characters, enforced on the frontend and validated on the backend.

---

*Part of the Prompt Injection Demo project.*