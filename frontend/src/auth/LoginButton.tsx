import { useAuth0 } from "@auth0/auth0-react";

export const LoginButton = () => {
  const { loginWithRedirect, isLoading } = useAuth0();

  return (
    <button
      onClick={() => loginWithRedirect()}
      disabled={isLoading}
      className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
    >
      Log in
    </button>
  );
};
