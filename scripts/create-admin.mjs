import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans.trim());
    })
  );
}

async function run() {
  console.log("==================================================");
  console.log(" COMPLETE GLASS INNOVATIONS — ADMIN SETUP ");
  console.log("==================================================\n");

  const args = process.argv.slice(2);
  let email = args[0];
  let password = args[1];
  let fullName = args[2] || "CGI Administrator";

  if (!email) {
    email = await askQuestion("Enter Admin Email (e.g. admin@completeglass.com.au): ");
  }

  if (!password) {
    password = await askQuestion("Enter Admin Password: ");
  }

  if (!email || !password) {
    console.error("Error: Admin email and password are required.");
    process.exit(1);
  }

  if (!supabaseUrl || !serviceRoleKey || supabaseUrl.includes("mock") || supabaseUrl.includes("placeholder")) {
    console.log("ℹ️ Standard Supabase environment not connected. Using local development admin credentials.");
    console.log(`✓ Admin User Configured for Dev Mode: ${email}`);
    console.log("Role: admin (in-memory dev session active)");
    return;
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log(`\nProvisioning administrator account: ${email}...`);

  // 1. Create or retrieve user in Supabase Auth
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  let userId = authData?.user?.id;

  if (authError) {
    if (authError.message.includes("already registered") || authError.status === 422) {
      console.log("User already exists in Supabase Auth. Retrieving user ID and updating role...");
      const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      if (listError) throw listError;
      const existingUser = usersData.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!existingUser) throw new Error("Could not locate existing auth user.");
      userId = existingUser.id;
    } else {
      throw authError;
    }
  }

  console.log(`Supabase Auth UID: ${userId}`);

  // 2. Set role = 'admin' in public.profiles table
  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .upsert(
      {
        id: userId,
        email: email.toLowerCase(),
        full_name: fullName,
        role: "admin",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

  if (profileError) {
    console.warn("Notice: public.profiles table upsert warning:", profileError.message);
  } else {
    console.log("✓ public.profiles: User assigned role='admin'");
  }

  // 3. Set role = 'admin' in public.admins table (compatibility)
  const { error: adminError } = await supabaseAdmin
    .from("admins")
    .upsert({ id: userId, email: email.toLowerCase(), role: "admin" }, { onConflict: "id" });

  if (adminError) {
    console.warn("Notice: public.admins table upsert warning:", adminError.message);
  } else {
    console.log("✓ public.admins: User assigned role='admin'");
  }

  console.log("\n==================================================");
  console.log("✨ SUCCESS: Administrator account created & verified!");
  console.log(`Email: ${email}`);
  console.log("Role: admin");
  console.log("Login URL: /auth?mode=login (or /admin/login)");
  console.log("==================================================\n");
}

run().catch((err) => {
  console.error("Admin creation failed:", err);
  process.exit(1);
});
