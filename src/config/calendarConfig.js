export const CALENDAR_CONFIG = {
  // The Service Account Email acts as the Calendar ID
  calendarId: import.meta.env.CALENDAR_ID,

  // Provided Unique Key (numeric ID)
  clientId: import.meta.env.CALENDAR_CLIENT_ID,

  // NOTE: Google Calendar API v3 usually requires an API Key for public fetching.
  apiKey: import.meta.env.CALENDAR_API_KEY,
};

