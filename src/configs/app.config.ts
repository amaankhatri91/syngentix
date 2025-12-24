export type AppConfig = {
  apiPrefix: string;
  googleClientId: string;
  authenticatedEntryPath: string;
  unAuthenticatedEntryPath: string;
  tourPath: string;
  locale: string;
};

const appConfig: AppConfig = {
  apiPrefix: import.meta.env.VITE_API_PREFIX,
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  authenticatedEntryPath: "/home",
  unAuthenticatedEntryPath: "/sign-in",
  tourPath: "/",
  locale: "en",
};

export default appConfig;
