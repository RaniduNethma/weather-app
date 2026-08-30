import { AuthGate } from "./auth/AuthGate";
import { Dashboard } from "./components/Dashboard";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <AuthGate>
        <Dashboard />
      </AuthGate>
    </div>
  );
}

export default App;
