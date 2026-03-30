import axios from 'axios';
import {
  CHAT_INTEGRATION_URL,
  TRIAGE_URL,
  GUARDED_TRIAGE_URL,
  ALL_TICKETS_URL,
  CURRENT_MODEL_URL,
  CLEAR_SESSION_URL,
} from '../constants';

/**
 * API Service
 *
 * All backend responses are wrapped in StandardResponse:
 *   { success: boolean, message: string|null, data: T|null, timestamp: string }
 */

const apiClient = axios.create({
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// ─── Chat Integration ────────────────────────────────────────────────

export const sendChatMessage = async (chatMessage, sessionId) => {
  const response = await apiClient.post(CHAT_INTEGRATION_URL, {
    chatMessage,
    sessionId,
  });
  return response.data.data;
};

// ─── Triage (Vulnerable) ────────────────────────────────────────────

export const submitVulnerableTriage = async (reporterName, bugDescription) => {
  const response = await apiClient.post(TRIAGE_URL, {
    reporterName,
    bugDescription,
  });
  return response.data.data;
};

// ─── Triage (Guarded) ───────────────────────────────────────────────

export const submitGuardedTriage = async (reporterName, bugDescription) => {
  const response = await apiClient.post(GUARDED_TRIAGE_URL, {
    reporterName,
    bugDescription,
  });
  return response.data.data;
};

// ─── Tickets ────────────────────────────────────────────────────────

export const getAllTickets = async () => {
  const response = await apiClient.get(ALL_TICKETS_URL);
  return response.data.data;
};

export const deleteAllTickets = async () => {
  const response = await apiClient.delete(ALL_TICKETS_URL);
  return response.data.message;
};

export const deleteTicketById = async (bugUuid) => {
  const response = await apiClient.delete(`${ALL_TICKETS_URL}/${bugUuid}`);
  return response.data.message;
};

// ─── Model Management ───────────────────────────────────────────────

export const getCurrentModel = async () => {
  const response = await apiClient.get(CURRENT_MODEL_URL);
  return response.data.data;
};

export const clearSession = async (sessionId) => {
  const response = await apiClient.delete(`${CLEAR_SESSION_URL}/${sessionId}`);
  return response.data.message;
};