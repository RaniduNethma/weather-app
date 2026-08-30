interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <div className="mx-auto max-w-md rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950 p-6 text-center mt-16">
      <p className="text-red-700 dark:text-red-300 font-medium mb-3">
        Couldn't load the dashboard
      </p>
      <p className="text-sm text-red-600 dark:text-red-400 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
};
