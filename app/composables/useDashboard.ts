import type { DashboardStats } from "#types/dashboard/dashboardStats";

// To Do: Change to have sold artwork count instead of posts
export function useDashboard() {
  const getStats = async () =>
    useFetch<DashboardStats>("/api/dashboard/dashboard", {
      transform: (stats) => ({
        artworks: stats?.artworks ?? 0,
        posts: stats?.posts ?? 0,
        orders: stats?.orders ?? 0,
      }),
      credentials: "include",
    });

  return { getStats };
}
