export const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
      <p className="text-slate-500 dark:text-slate-400 text-sm">
        Loading weather data...
      </p>
    </div>
  );
};
