import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/subscriptions - List all subscriptions
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const clientId = searchParams.get("client_id");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = supabase
      .from("subscriptions")
      .select("*, clients(id, name, email)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by status
    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    // Filter by client
    if (clientId) {
      query = query.eq("client_id", clientId);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching subscriptions:", error);
      return NextResponse.json(
        { error: "Failed to fetch subscriptions", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      subscriptions: data || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/subscriptions - Create new subscription
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    const { client_id, plan, amount, next_billing_date } = body;
    if (!client_id || !plan || !amount || !next_billing_date) {
      return NextResponse.json(
        { error: "client_id, plan, amount, and next_billing_date are required" },
        { status: 400 }
      );
    }

    // Verify client exists
    const { data: client } = await supabase
      .from("clients")
      .select("id, name")
      .eq("id", client_id)
      .single();

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Check if client already has an active subscription
    const { data: existing } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("client_id", client_id)
      .in("status", ["active", "pending"]);

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: "Client already has an active subscription" },
        { status: 409 }
      );
    }

    // Create subscription
    const { data, error } = await supabase
      .from("subscriptions")
      .insert([
        {
          client_id,
          plan,
          amount,
          setup_fee: body.setup_fee || 0,
          status: body.status || "active",
          billing_cycle: body.billing_cycle || "monthly",
          next_billing_date,
          payment_method_id: body.payment_method_id || null,
        },
      ])
      .select("*, clients(id, name, email)")
      .single();

    if (error) {
      console.error("Error creating subscription:", error);
      return NextResponse.json(
        { error: "Failed to create subscription", details: error.message },
        { status: 500 }
      );
    }

    // Update client subscription status
    await supabase
      .from("clients")
      .update({ subscription_status: data.status })
      .eq("id", client_id);

    // Log activity
    await supabase.from("activity_log").insert([
      {
        client_id,
        action: "subscription_created",
        description: `Assinatura ${plan} criada (R$ ${amount})`,
      },
    ]);

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
