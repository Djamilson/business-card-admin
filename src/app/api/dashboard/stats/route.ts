import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/dashboard/stats - Get dashboard statistics
export async function GET() {
  try {
    // Fetch all data in parallel
    const [
      { data: clients, error: clientsError },
      { data: subscriptions, error: subscriptionsError },
      { data: invoices, error: invoicesError },
    ] = await Promise.all([
      supabase.from("clients").select("id, subscription_status, created_at"),
      supabase.from("subscriptions").select("id, amount, status, next_billing_date"),
      supabase.from("invoices").select("id, amount, status, due_date"),
    ]);

    if (clientsError || subscriptionsError || invoicesError) {
      console.error("Error fetching stats:", {
        clientsError,
        subscriptionsError,
        invoicesError,
      });
      return NextResponse.json(
        { error: "Failed to fetch dashboard stats" },
        { status: 500 }
      );
    }

    // Calculate statistics
    const activeClients = clients?.filter(
      (c) => c.subscription_status === "active"
    ).length || 0;

    const totalClients = clients?.length || 0;

    // Calculate MRR (Monthly Recurring Revenue)
    const mrr =
      subscriptions
        ?.filter((s) => s.status === "active")
        .reduce((sum, s) => sum + Number(s.amount), 0) || 0;

    // Calculate ARR (Annual Recurring Revenue)
    const arr = mrr * 12;

    // Calculate churn rate (simplified - canceled in last 30 days / total clients)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const canceledRecently =
      clients?.filter((c) => {
        return (
          c.subscription_status === "canceled" &&
          new Date(c.created_at) > thirtyDaysAgo
        );
      }).length || 0;

    const churnRate = totalClients > 0 ? (canceledRecently / totalClients) * 100 : 0;

    // Get recent clients (last 5)
    const recentClients = clients
      ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
      .map((c) => c.id) || [];

    // Get upcoming invoices (next 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const upcomingInvoices =
      invoices
        ?.filter((i) => {
          const dueDate = new Date(i.due_date);
          return (
            i.status === "pending" &&
            dueDate <= thirtyDaysFromNow &&
            dueDate >= new Date()
          );
        })
        .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
        .slice(0, 5) || [];

    // Calculate invoice stats
    const paidInvoices =
      invoices?.filter((i) => i.status === "paid") || [];
    const totalReceived = paidInvoices.reduce(
      (sum, i) => sum + Number(i.amount),
      0
    );

    const pendingInvoices =
      invoices?.filter((i) => i.status === "pending") || [];
    const totalPending = pendingInvoices.reduce(
      (sum, i) => sum + Number(i.amount),
      0
    );

    const overdueInvoices =
      invoices?.filter((i) => {
        return (
          i.status === "overdue" || (
            i.status === "pending" &&
            new Date(i.due_date) < new Date()
          )
        );
      }) || [];
    const totalOverdue = overdueInvoices.reduce(
      (sum, i) => sum + Number(i.amount),
      0
    );

    // Subscription breakdown
    const activeSubscriptions =
      subscriptions?.filter((s) => s.status === "active").length || 0;
    const pendingSubscriptions =
      subscriptions?.filter((s) => s.status === "pending").length || 0;
    const canceledSubscriptions =
      subscriptions?.filter((s) => s.status === "canceled").length || 0;

    // Calculate growth
    const previousMonthClients = clients?.filter((c) => {
      const createdDate = new Date(c.created_at);
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return createdDate < lastMonth;
    }).length || 0;

    const clientGrowth = previousMonthClients > 0
      ? ((activeClients - previousMonthClients) / previousMonthClients) * 100
      : 0;

    return NextResponse.json({
      overview: {
        activeClients,
        totalClients,
        mrr,
        arr,
        churnRate,
        clientGrowth,
      },
      subscriptions: {
        active: activeSubscriptions,
        pending: pendingSubscriptions,
        canceled: canceledSubscriptions,
        total: subscriptions?.length || 0,
        mrr,
      },
      invoices: {
        total: invoices?.length || 0,
        paid: paidInvoices.length,
        pending: pendingInvoices.length,
        overdue: overdueInvoices.length,
        totalReceived,
        totalPending,
        totalOverdue,
      },
      recentClients,
      upcomingInvoices,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
