"use client";

import { useEffect, useState } from "react";

export interface DashboardStats {
  overview: {
    activeClients: number;
    totalClients: number;
    mrr: number;
    arr: number;
    churnRate: number;
    clientGrowth: number;
  };
  subscriptions: {
    active: number;
    pending: number;
    canceled: number;
    total: number;
    mrr: number;
  };
  invoices: {
    total: number;
    paid: number;
    pending: number;
    overdue: number;
    totalReceived: number;
    totalPending: number;
    totalOverdue: number;
  };
  recentClients: string[];
  upcomingInvoices: any[];
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/dashboard/stats");

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard stats");
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, error, refetch: fetchStats };
}
