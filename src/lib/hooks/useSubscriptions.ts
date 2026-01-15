"use client";

import { useEffect, useState } from "react";
import type { Subscription } from "@/lib/supabase";

interface UseSubscriptionsOptions {
  status?: string;
  clientId?: string;
  limit?: number;
  offset?: number;
}

export function useSubscriptions(options: UseSubscriptionsOptions = {}) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options.status) params.append("status", options.status);
      if (options.clientId) params.append("client_id", options.clientId);
      if (options.limit) params.append("limit", options.limit.toString());
      if (options.offset) params.append("offset", options.offset.toString());

      const response = await fetch(`/api/subscriptions?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch subscriptions");
      }

      const data = await response.json();
      setSubscriptions(data.subscriptions);
      setTotal(data.total);
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.status, options.clientId, options.limit, options.offset]);

  const cancelSubscription = async (id: string) => {
    try {
      const response = await fetch(`/api/subscriptions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to cancel subscription");
      }

      // Refresh list
      await fetchSubscriptions();
      return true;
    } catch (err) {
      console.error("Error canceling subscription:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      return false;
    }
  };

  return {
    subscriptions,
    total,
    loading,
    error,
    refetch: fetchSubscriptions,
    cancelSubscription,
  };
}
