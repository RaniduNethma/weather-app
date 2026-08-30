import { DashboardResponse } from "../types/types";

const apiBaseURL = import.meta.env.VITE_API_BASE_URL;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export const fetchDashboard = async (
  accessToken: string,
): Promise<DashboardResponse> => {
  const response = await fetch(`${apiBaseURL}/api/dashboard`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(
      body.message ?? `Request failed with status ${response.status}`,
      response.status,
    );
  }

  return response.json();
};
