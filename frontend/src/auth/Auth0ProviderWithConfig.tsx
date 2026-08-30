import { AppState, Auth0Provider } from "@auth0/auth0-react";
import { ReactNode } from "react";

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

interface Props {
  children: ReactNode;
}

// Wraps the app with Auth0's provider
export const Auth0ProviderWithConfig = ({ children }: Props) => {
  if (!domain || !clientId || !audience) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md text-center text-sm text-red-600 dark:text-red-400">
          Missing Auth0 configuration. Set VITE_AUTH0_DOMAIN,
          VITE_AUTH0_CLIENT_ID and VITE_AUTH0_AUDIENCE in frontend/.env.
        </div>
      </div>
    );
  }

  const onRedirectCallback = (appState?: AppState) => {
    window.history.replaceState(
      {},
      document.title,
      appState?.returnTo ?? window.location.pathname,
    );
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience,
      }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="localstorage"
      useRefreshTokens
    >
      {children}
    </Auth0Provider>
  );
};
