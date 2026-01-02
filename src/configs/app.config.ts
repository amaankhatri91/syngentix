export type AppConfig = {
  apiPrefix: string;
  socketBaseUrl: string;
  googleClientId: string;
  authenticatedEntryPath: string;
  unAuthenticatedEntryPath: string;
  tourPath: string;
  locale: string;
};

const appConfig: AppConfig = {
  apiPrefix: import.meta.env.VITE_API_BASE_URL,
  socketBaseUrl: import.meta.env.VITE_SOCKET_BASE_URL,
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  authenticatedEntryPath: "/home",
  unAuthenticatedEntryPath: "/sign-in",
  tourPath: "/",
  locale: "en",
};

export default appConfig;
