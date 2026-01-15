import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type Params = {
  params: {
    id: string;
  };
};

// GET /api/invoices/:id - Get single invoice
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;

    const { data, error } = await supabase
      .from("invoices")
      .select("*, clients(id, name, email), subscriptions(plan)")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
      }
      console.error("Error fetching invoice:", error);
      return NextResponse.json(
        { error: "Failed to fetch invoice", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/invoices/:id - Update invoice
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();

    // Remove fields that shouldn't be updated directly
    const { created_at, updated_at, clients, subscriptions, invoice_number, ...updateData } = body;

    // If marking as paid, set paid_at timestamp
    if (updateData.status === "paid" && !updateData.paid_at) {
      updateData.paid_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("invoices")
      .update(updateData)
      .eq("id", id)
      .select("*, clients(id, name, email)")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
      }
      console.error("Error updating invoice:", error);
      return NextResponse.json(
        { error: "Failed to update invoice", details: error.message },
        { status: 500 }
      );
    }

    // Log activity
    await supabase.from("activity_log").insert([
      {
        client_id: data.client_id,
        action: "invoice_updated",
        description: `Fatura ${data.invoice_number} atualizada`,
        metadata: updateData,
      },
    ]);

    // If paid, create payment history record
    if (updateData.status === "paid") {
      await supabase.from("payment_history").insert([
        {
          client_id: data.client_id,
          invoice_id: id,
          amount: data.amount,
          status: "success",
          payment_method: updateData.payment_method || data.payment_method,
        },
      ]);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/invoices/:id - Delete or cancel invoice
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;

    // Get invoice details
    const { data: invoice } = await supabase
      .from("invoices")
      .select("id, client_id, invoice_number, status")
      .eq("id", id)
      .single();

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // If invoice is paid, don't allow deletion
    if (invoice.status === "paid") {
      return NextResponse.json(
        { error: "Cannot delete paid invoices. Cancel instead." },
        { status: 400 }
      );
    }

    // Update status to canceled instead of deleting
    const { error } = await supabase
      .from("invoices")
      .update({ status: "canceled" })
      .eq("id", id);

    if (error) {
      console.error("Error canceling invoice:", error);
      return NextResponse.json(
        { error: "Failed to cancel invoice", details: error.message },
        { status: 500 }
      );
    }

    // Log activity
    await supabase.from("activity_log").insert([
      {
        client_id: invoice.client_id,
        action: "invoice_canceled",
        description: `Fatura ${invoice.invoice_number} cancelada`,
      },
    ]);

    return NextResponse.json({ message: "Invoice canceled successfully" });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
