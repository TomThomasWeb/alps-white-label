import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email, role, client_id } = await request.json();

    if (!name || !email || !client_id) {
      return NextResponse.json({ error: "Name, email, and client_id are required" }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get the app URL for redirect
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://portal.tomthomas.co.uk";

    // 1. Create auth user and send invite email
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      email,
      { redirectTo: `${appUrl}/auth/callback` }
    );

    if (authError) {
      // If user already exists, find their auth ID and link
      if (authError.message?.includes("already") || authError.status === 422) {
        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
        const existing = existingUsers?.users?.find((u: { email?: string }) => u.email === email);

        if (existing) {
          const initials = name.split(" ").map((w: string) => w[0]).join("").substring(0, 2).toUpperCase();
          
          // Check if portal profile already exists
          const { data: existingProfile } = await supabaseAdmin
            .from("users")
            .select("id")
            .eq("auth_id", existing.id)
            .single();

          if (existingProfile) {
            return NextResponse.json({ error: "This user already has portal access." }, { status: 400 });
          }

          const { data: profile, error: profileError } = await supabaseAdmin
            .from("users")
            .insert({ auth_id: existing.id, client_id, name, email, role: role || "client-admin", avatar_initials: initials })
            .select()
            .single();

          if (profileError) {
            return NextResponse.json({ error: "Profile error: " + profileError.message }, { status: 400 });
          }
          return NextResponse.json({ success: true, user: profile, message: "User already had an account. Portal access linked." });
        }
      }
      return NextResponse.json({ error: "Auth error: " + authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }

    // 2. Create portal user profile
    const initials = name.split(" ").map((w: string) => w[0]).join("").substring(0, 2).toUpperCase();
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("users")
      .insert({ auth_id: authData.user.id, client_id, name, email, role: role || "client-admin", avatar_initials: initials })
      .select()
      .single();

    if (profileError) {
      return NextResponse.json({ error: "Profile error: " + profileError.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      user: profile,
      message: `Invite sent to ${email}. They will receive an email to set their password.`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
