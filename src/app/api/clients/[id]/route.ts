import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type Params = {
  params: {
    id: string;
  };
};

// GET /api/clients/:id - Get single client by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;

    const { data, error } = await supabase
      .from("clients")
      .select("*, subscriptions(*), card_configs(*), invoices(count)")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Client not found" }, { status: 404 });
      }
      console.error("Error fetching client:", error);
      return NextResponse.json(
        { error: "Failed to fetch client", details: error.message },
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

// PATCH /api/clients/:id - Update client
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();

    // Remove fields that shouldn't be updated directly
    const { created_at, updated_at, subscriptions, card_configs, invoices, ...updateData } = body;

    const { data, error } = await supabase
      .from("clients")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Client not found" }, { status: 404 });
      }
      console.error("Error updating client:", error);
      return NextResponse.json(
        { error: "Failed to update client", details: error.message },
        { status: 500 }
      );
    }

    // Log activity
    await supabase.from("activity_log").insert([
      {
        client_id: id,
        action: "client_updated",
        description: `Cliente atualizado`,
        metadata: updateData,
      },
    ]);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/clients/:id - Delete client
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;

    // Check if client exists
    const { data: client } = await supabase
      .from("clients")
      .select("id, name")
      .eq("id", id)
      .single();

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Delete client (cascades to subscriptions, invoices, etc.)
    const { error } = await supabase.from("clients").delete().eq("id", id);

    if (error) {
      console.error("Error deleting client:", error);
      return NextResponse.json(
        { error: "Failed to delete client", details: error.message },
        { status: 500 }
      );
    }

    // Log activity (will be orphaned since client is deleted, but good for audit)
    await supabase.from("activity_log").insert([
      {
        client_id: null,
        action: "client_deleted",
        description: `Cliente ${client.name} (ID: ${id}) foi removido do sistema`,
      },
    ]);

    return NextResponse.json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
