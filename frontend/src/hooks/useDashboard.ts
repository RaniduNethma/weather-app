import { useAuth0 } from "@auth0/auth0-react";
import { DashboardResponse } from "../types/types";
import { useCallback, useEffect, useState } from "react";
import { fetchDashboard } from "../services/apiService";

interface UseDashboardState {
  data: DashboardResponse | null;
  isLoading: boolean;
  error: string | null;
}

export const useDashboard = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [state, setState] = useState<UseDashboardState>({
    data: null,
    isLoading: true,
    error: null,
  });

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const accessToken = await getAccessTokenSilently();
      const data = await fetchDashboard(accessToken);
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to load dashboard",
      });
    }
  }, [getAccessTokenSilently]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, refetch: load };
};
