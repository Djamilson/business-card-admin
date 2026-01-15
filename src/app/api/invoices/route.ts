import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/invoices - List all invoices
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const clientId = searchParams.get("client_id");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = supabase
      .from("invoices")
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
      console.error("Error fetching invoices:", error);
      return NextResponse.json(
        { error: "Failed to fetch invoices", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      invoices: data || [],
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

// POST /api/invoices - Create new invoice
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    const { client_id, amount, due_date } = body;
    if (!client_id || !amount || !due_date) {
      return NextResponse.json(
        { error: "client_id, amount, and due_date are required" },
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

    // Generate invoice number
    const { data: invoiceNumberResult, error: invoiceNumberError } = await supabase
      .rpc("generate_invoice_number");

    if (invoiceNumberError) {
      console.error("Error generating invoice number:", invoiceNumberError);
      // Fallback to simple counter if function doesn't exist
      const timestamp = Date.now().toString().slice(-8);
      var invoice_number = `INV-${timestamp}`;
    } else {
      var invoice_number = invoiceNumberResult;
    }

    // Create invoice
    const { data, error } = await supabase
      .from("invoices")
      .insert([
        {
          client_id,
          subscription_id: body.subscription_id || null,
          invoice_number,
          amount,
          status: body.status || "pending",
          due_date,
          payment_method: body.payment_method || null,
          notes: body.notes || null,
        },
      ])
      .select("*, clients(id, name, email)")
      .single();

    if (error) {
      console.error("Error creating invoice:", error);
      return NextResponse.json(
        { error: "Failed to create invoice", details: error.message },
        { status: 500 }
      );
    }

    // Log activity
    await supabase.from("activity_log").insert([
      {
        client_id,
        action: "invoice_created",
        description: `Fatura ${invoice_number} criada (R$ ${amount})`,
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
