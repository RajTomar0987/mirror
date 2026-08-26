import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey || supabaseUrl.includes("mock") || supabaseUrl.includes("placeholder")) {
  console.error("Error: Standard Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) must be configured in .env.local to run this script against a live Supabase instance.");
  process.exit(1);
}

const args = process.argv.slice(2);
const email = args[0];
const password = args[1];

if (!email || !password) {
  console.log("Usage: node scripts/create-admin.mjs <email> <password>");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  console.log(`Creating development admin user: ${email}...`);

  // 1. Create user in Supabase Auth
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  let userId = authData?.user?.id;

  if (authError) {
    if (authError.message.includes("already registered") || authError.status === 422) {
      console.log("User already exists in Supabase Auth. Fetching existing user ID...");
      const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      if (listError) throw listError;
      const existingUser = usersData.users.find((u) => u.email === email);
      if (!existingUser) throw new Error("Could not find existing user.");
      userId = existingUser.id;
    } else {
      throw authError;
    }
  }

  console.log(`Supabase Auth User ID: ${userId}`);

  // 2. Insert/Update admin role in public.admins table
  const { data: adminData, error: adminError } = await supabaseAdmin
    .from("admins")
    .upsert({ id: userId, email, role: "admin" }, { onConflict: "id" })
    .select()
    .single();

  if (adminError) {
    throw adminError;
  }

  console.log("Success! Admin user created and granted admin role in public.admins table:");
  console.log(adminData);
}

main().catch((err) => {
  console.error("Error creating admin user:", err);
  process.exit(1);
});
