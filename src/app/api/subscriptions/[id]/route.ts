import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type Params = {
  params: {
    id: string;
  };
};

// GET /api/subscriptions/:id - Get single subscription
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;

    const { data, error } = await supabase
      .from("subscriptions")
      .select("*, clients(id, name, email), invoices(count)")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Subscription not found" },
          { status: 404 }
        );
      }
      console.error("Error fetching subscription:", error);
      return NextResponse.json(
        { error: "Failed to fetch subscription", details: error.message },
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

// PATCH /api/subscriptions/:id - Update subscription
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();

    // Remove fields that shouldn't be updated directly
    const { created_at, updated_at, clients, invoices, ...updateData } = body;

    const { data, error } = await supabase
      .from("subscriptions")
      .update(updateData)
      .eq("id", id)
      .select("*, clients(id, name, email)")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Subscription not found" },
          { status: 404 }
        );
      }
      console.error("Error updating subscription:", error);
      return NextResponse.json(
        { error: "Failed to update subscription", details: error.message },
        { status: 500 }
      );
    }

    // Update client subscription status if status changed
    if (updateData.status) {
      await supabase
        .from("clients")
        .update({ subscription_status: updateData.status })
        .eq("id", data.client_id);
    }

    // Log activity
    await supabase.from("activity_log").insert([
      {
        client_id: data.client_id,
        action: "subscription_updated",
        description: `Assinatura atualizada`,
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

// DELETE /api/subscriptions/:id - Cancel subscription
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;

    // Get subscription details
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("id, client_id, clients(name)")
      .eq("id", id)
      .single();

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    // Instead of deleting, cancel the subscription
    const { error } = await supabase
      .from("subscriptions")
      .update({ status: "canceled" })
      .eq("id", id);

    if (error) {
      console.error("Error canceling subscription:", error);
      return NextResponse.json(
        { error: "Failed to cancel subscription", details: error.message },
        { status: 500 }
      );
    }

    // Update client status
    await supabase
      .from("clients")
      .update({ subscription_status: "canceled" })
      .eq("id", subscription.client_id);

    // Log activity
    await supabase.from("activity_log").insert([
      {
        client_id: subscription.client_id,
        action: "subscription_canceled",
        description: `Assinatura cancelada`,
      },
    ]);

    return NextResponse.json({ message: "Subscription canceled successfully" });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
