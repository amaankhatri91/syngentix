import { useEffect, useRef, useState } from "react";
import appConfig from "@/configs/app.config";

// ================= TYPES =================
export interface GoogleUser {
  email: string;
  display_name: string;
  google_id: string;
  photo_url: string;
}

// Google Identity types
declare global {
  interface Window {
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            callback: (response: { access_token?: string }) => void;
            scope: string;
            ux_mode?: 'popup' | 'redirect';
            redirect_uri?: string;
          }) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
}

// ================= HOOK =================
const useGoogleAuth = () => {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const isRequestActive = useRef(false);

  // ---------------- Load Google SDK ----------------
  useEffect(() => {
    if (window.google) {
      setIsGoogleLoaded(true);
      return;
    }

    const interval = setInterval(() => {
      if (window.google) {
        clearInterval(interval);
        setIsGoogleLoaded(true);
      }
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  // ---------------- Google Login ----------------
  const triggerGoogleLogin = (): Promise<GoogleUser> => {
    return new Promise((resolve, reject) => {
      if (!window.google || !appConfig.googleClientId) {
        reject(
          new Error("Google OAuth not available. Please refresh the page.")
        );
        return;
      }

      // Prevent multiple parallel requests
      if (isRequestActive.current) {
        reject(new Error("Google login already in progress"));
        return;
      }

      isRequestActive.current = true;
      let isResolved = false;

      // Detect popup closure - when user closes popup, window regains focus
      let wasBlurred = false;
      let focusTimeout: NodeJS.Timeout | null = null;

      const cleanup = () => {
        window.removeEventListener('blur', handleBlur);
        window.removeEventListener('focus', handleFocus);
        if (focusTimeout) clearTimeout(focusTimeout);
        if (timeout) clearTimeout(timeout);
      };

      const handleBlur = () => {
        wasBlurred = true;
      };

      const handleFocus = () => {
        if (wasBlurred && !isResolved) {
          // Wait a moment to see if callback fires
          if (focusTimeout) clearTimeout(focusTimeout);
          focusTimeout = setTimeout(() => {
            if (!isResolved && isRequestActive.current) {
              isRequestActive.current = false;
              isResolved = true;
              cleanup();
              reject(new Error("Google sign-in cancelled"));
            }
          }, 1500);
        }
      };

      // Fallback timeout (5 minutes)
      const timeout = setTimeout(() => {
        if (!isResolved && isRequestActive.current) {
          isRequestActive.current = false;
          isResolved = true;
          cleanup();
          reject(new Error("Google sign-in timed out"));
        }
      }, 300000);

      window.addEventListener('blur', handleBlur);
      window.addEventListener('focus', handleFocus);

      // Use popup mode for modal experience
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: appConfig.googleClientId,
        scope: "email profile",
        ux_mode: 'popup',
        callback: async (response) => {
          try {
            // ❌ User cancelled or no access token
            if (!response?.access_token) {
              isRequestActive.current = false;
              isResolved = true;
              cleanup();
              reject(new Error("Google sign-in cancelled"));
              return;
            }

            // 🔥 Fetch Google profile
            const userRes = await fetch(
              "https://www.googleapis.com/oauth2/v3/userinfo",
              {
                headers: {
                  Authorization: `Bearer ${response.access_token}`,
                },
              }
            );

            if (!userRes.ok) {
              isRequestActive.current = false;
              isResolved = true;
              cleanup();
              reject(new Error("Failed to fetch Google user profile"));
              return;
            }

            const user = await userRes.json();

            // ✅ Success
            isRequestActive.current = false;
            isResolved = true;
            cleanup();
            resolve({
              email: user.email,
              display_name: user.name,
              google_id: user.sub,
              photo_url: user.picture,
            });
          } catch (error) {
            isRequestActive.current = false;
            isResolved = true;
            cleanup();
            reject(error);
          }
        },
      });

      // Trigger popup
      client.requestAccessToken();
    });
  };

  return {
    triggerGoogleLogin,
    isGoogleLoaded,
  };
};

export default useGoogleAuth;
