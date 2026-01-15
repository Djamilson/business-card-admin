"use client";

import { useEffect, useState } from "react";
import type { Invoice } from "@/lib/supabase";

interface UseInvoicesOptions {
  status?: string;
  clientId?: string;
  limit?: number;
  offset?: number;
}

export function useInvoices(options: UseInvoicesOptions = {}) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options.status) params.append("status", options.status);
      if (options.clientId) params.append("client_id", options.clientId);
      if (options.limit) params.append("limit", options.limit.toString());
      if (options.offset) params.append("offset", options.offset.toString());

      const response = await fetch(`/api/invoices?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch invoices");
      }

      const data = await response.json();
      setInvoices(data.invoices);
      setTotal(data.total);
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.status, options.clientId, options.limit, options.offset]);

  const cancelInvoice = async (id: string) => {
    try {
      const response = await fetch(`/api/invoices/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to cancel invoice");
      }

      // Refresh list
      await fetchInvoices();
      return true;
    } catch (err) {
      console.error("Error canceling invoice:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      return false;
    }
  };

  const markAsPaid = async (id: string, paymentMethod?: string) => {
    try {
      const response = await fetch(`/api/invoices/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "paid",
          payment_method: paymentMethod,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark invoice as paid");
      }

      // Refresh list
      await fetchInvoices();
      return true;
    } catch (err) {
      console.error("Error marking invoice as paid:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      return false;
    }
  };

  return {
    invoices,
    total,
    loading,
    error,
    refetch: fetchInvoices,
    cancelInvoice,
    markAsPaid,
  };
}
