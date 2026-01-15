import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export type SubscriptionStatus = "active" | "canceled" | "suspended" | "past_due";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subdomain: string;
  custom_domain?: string;
  subscription_status: SubscriptionStatus;
  subscription_start: string;
  subscription_end?: string;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  client_id: string;
  plan: "monthly" | "annual";
  amount: number;
  status: SubscriptionStatus;
  next_billing_date: string;
  payment_method_id?: string;
}

export interface Invoice {
  id: string;
  client_id: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  due_date: string;
  paid_at?: string;
  invoice_url?: string;
}

export interface CardConfig {
  id: string;
  client_id: string;
  profile_data: {
    name: string;
    title: string;
    description: string;
    avatar_url?: string;
  };
  contact_info: {
    whatsapp: string;
    email: string;
    website?: string;
    location?: string;
  };
  social_links: {
    instagram?: string;
    linkedin?: string;
    facebook?: string;
  };
  featured_property?: {
    title: string;
    description: string;
    image_url?: string;
    link_url?: string;
  };
  theme_colors: {
    primary?: string;
    secondary?: string;
  };
}
