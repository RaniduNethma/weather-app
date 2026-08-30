import { useAuth0 } from "@auth0/auth0-react";
import { ReactNode } from "react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { LoginButton } from "./LoginButton";

interface Props {
  children: ReactNode;
}

// gate that only renders dashboard once the user is authenticated
export const AuthGate = ({ children }: Props) => {
  const { isAuthenticated, isLoading, error } = useAuth0();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-red-600 dark:text-red-400 font-medium">
          Authentication error: {error.message}
        </p>
        <LoginButton />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Weather Comfort Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
            Sign in to view the comfort index rankings. Access is restricted to
            whitelisted accounts.
          </p>
        </div>
        <LoginButton />
      </div>
    );
  }

  return <>{children}</>;
};
