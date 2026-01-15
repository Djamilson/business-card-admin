import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

// GET /api/clients - List all clients with optional filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = supabase
      .from("clients")
      .select("*, subscriptions(*)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by status
    if (status && status !== "all") {
      query = query.eq("subscription_status", status);
    }

    // Search by name or email
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching clients:", error);
      return NextResponse.json(
        { error: "Failed to fetch clients", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      clients: data || [],
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

// POST /api/clients - Create new client
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    const { name, email, subdomain } = body;
    if (!name || !email || !subdomain) {
      return NextResponse.json(
        { error: "Name, email, and subdomain are required" },
        { status: 400 }
      );
    }

    // Check if email or subdomain already exists
    const { data: existing } = await supabase
      .from("clients")
      .select("id, email, subdomain")
      .or(`email.eq.${email},subdomain.eq.${subdomain}`);

    if (existing && existing.length > 0) {
      const conflicts = [];
      if (existing.some((c) => c.email === email)) {
        conflicts.push("email");
      }
      if (existing.some((c) => c.subdomain === subdomain)) {
        conflicts.push("subdomain");
      }
      return NextResponse.json(
        {
          error: `${conflicts.join(" and ")} already in use`,
          conflicts,
        },
        { status: 409 }
      );
    }

    // Create client
    const { data, error } = await supabase
      .from("clients")
      .insert([
        {
          name,
          email,
          phone: body.phone || null,
          cpf_cnpj: body.cpf_cnpj || null,
          subdomain,
          custom_domain: body.custom_domain || null,
          subscription_status: body.subscription_status || "active",
          subscription_start: body.subscription_start || new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating client:", error);
      return NextResponse.json(
        { error: "Failed to create client", details: error.message },
        { status: 500 }
      );
    }

    // Log activity
    await supabase.from("activity_log").insert([
      {
        client_id: data.id,
        action: "client_created",
        description: `Cliente ${name} cadastrado no sistema`,
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
