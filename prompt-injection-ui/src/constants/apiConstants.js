/**
 * API Constants
 *
 * All backend endpoint paths and related configuration.
 * These mirror the Spring Boot PromptInjectionConstants.java values.
 * The Vite proxy forwards /v1 and /internal to localhost:8081.
 */

const BASE_API = '/v1/prompt-injection';

// Chat Integration endpoint
export const CHAT_INTEGRATION_URL = `${BASE_API}/api/chat-integration`;

// Triage endpoints
export const TRIAGE_URL = `${BASE_API}/api/triage`;
export const GUARDED_TRIAGE_URL = `${BASE_API}/api/guarded-triage`;
export const ALL_TICKETS_URL = `${BASE_API}/api/tickets`;

// Internal model management
export const CURRENT_MODEL_URL = '/internal/current-model';
export const AVAILABLE_MODELS_URL = '/internal/available-models';
export const UPDATE_MODEL_URL = '/internal/update-model';
export const CLEAR_SESSION_URL = '/internal/clear-session'; // append /{sessionId}