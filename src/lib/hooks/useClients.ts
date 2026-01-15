"use client";

import { useEffect, useState } from "react";
import type { Client } from "@/lib/supabase";

interface UseClientsOptions {
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export function useClients(options: UseClientsOptions = {}) {
  const [clients, setClients] = useState<Client[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options.status) params.append("status", options.status);
      if (options.search) params.append("search", options.search);
      if (options.limit) params.append("limit", options.limit.toString());
      if (options.offset) params.append("offset", options.offset.toString());

      const response = await fetch(`/api/clients?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch clients");
      }

      const data = await response.json();
      setClients(data.clients);
      setTotal(data.total);
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.status, options.search, options.limit, options.offset]);

  const deleteClient = async (id: string) => {
    try {
      const response = await fetch(`/api/clients/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete client");
      }

      // Refresh list
      await fetchClients();
      return true;
    } catch (err) {
      console.error("Error deleting client:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      return false;
    }
  };

  return { clients, total, loading, error, refetch: fetchClients, deleteClient };
}
