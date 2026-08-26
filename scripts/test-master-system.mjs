const BASE_URL = "http://localhost:3000";

async function runMasterVerification() {
  console.log("==================================================================");
  console.log(" MASTER VERIFICATION: SIGN UP + LOGIN + ROLE AUTH + QUOTES SYSTEM ");
  console.log("==================================================================\n");

  let passed = 0;
  let total = 0;

  function assert(condition, name, details = "") {
    total++;
    if (condition) {
      console.log(`✓ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name} ${details ? `(${details})` : ""}`);
    }
  }

  // TEST 1: Unauthenticated access to /admin/quotes redirects to /auth?mode=login
  console.log("1. Testing Unauthenticated Route Protection...");
  const unauthApiRes = await fetch(`${BASE_URL}/api/admin/quotes`);
  assert(unauthApiRes.status === 401, "GET /api/admin/quotes without token returns 401 Unauthorized");

  // TEST 2: Sign up a normal user (/api/auth/signup)
  console.log("\n2. Testing Public Sign Up Flow (/auth?mode=signup)...");
  const testUserEmail = `client.${Date.now()}@domain.com`;
  const signupRes = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: "Jane Regular Client",
      email: testUserEmail,
      password: "UserPassword123!",
      confirmPassword: "UserPassword123!",
    }),
  });
  const signupData = await signupRes.json();

  assert(signupRes.status === 201, "POST /api/auth/signup returns 201 Created");
  assert(signupData.success === true, "Signup returns success: true");
  assert(signupData.data?.role === "user", "Normal public signup automatically receives role='user'");

  // TEST 3: Login as normal user (/api/auth/login)
  console.log("\n3. Testing Normal User Login (/auth?mode=login)...");
  const userLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: testUserEmail,
      password: "UserPassword123!",
    }),
  });
  const userLoginData = await userLoginRes.json();
  const userToken = userLoginData.data?.access_token;

  assert(userLoginRes.status === 200, "POST /api/auth/login with normal credentials returns 200");
  assert(userLoginData.data?.user?.role === "user", "Logged in user has role='user'");
  assert(!!userToken, "User receives valid session access_token");

  // TEST 4: Normal user attempt to access /api/admin/quotes MUST be rejected
  console.log("\n4. Testing Access Control (Normal user cannot access admin quotes)...");
  const userAdminAttemptRes = await fetch(`${BASE_URL}/api/admin/quotes`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  assert(
    userAdminAttemptRes.status === 401 || userAdminAttemptRes.status === 403,
    "GET /api/admin/quotes as normal user returns 401/403 Access Denied"
  );

  // TEST 5: Admin Login (/api/auth/login)
  console.log("\n5. Testing Administrator Login (/auth?mode=login)...");
  const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@completeglass.com.au",
      password: "adminpass123",
    }),
  });
  const adminLoginData = await adminLoginRes.json();
  const adminToken = adminLoginData.data?.access_token;
  const adminCookie = adminLoginRes.headers.get("set-cookie");

  assert(adminLoginRes.status === 200, "POST /api/auth/login with admin credentials returns 200");
  assert(adminLoginData.data?.user?.role === "admin", "Admin user role is verified as 'admin'");
  assert(!!adminToken, "Admin receives valid admin session token");

  const adminAuthHeaders = {
    Authorization: `Bearer ${adminToken}`,
    Cookie: adminCookie || `cgi_admin_session=${adminToken}`,
  };

  // TEST 6: Admin access to /api/admin/quotes
  console.log("\n6. Testing Admin Quotes Dashboard Access...");
  const adminQuotesRes = await fetch(`${BASE_URL}/api/admin/quotes`, { headers: adminAuthHeaders });
  const adminQuotesData = await adminQuotesRes.json();

  assert(adminQuotesRes.status === 200, "GET /api/admin/quotes with admin token returns 200");
  assert(Array.isArray(adminQuotesData.data), "GET /api/admin/quotes returns quote array");

  // TEST 7: Submit a quote from public website (/api/quote)
  console.log("\n7. Testing Public Quote Form Submission (/quote -> /api/quote)...");
  const newQuotePayload = {
    name: "Sir David Attenborough",
    email: "david@coastalglazing.com.au",
    phone: "0499 888 777",
    suburb: "Mosman, NSW",
    service: "Glass Balustrades",
    description: "Frameless 15mm toughened balustrade around multi-tier terrace.",
    preferredContact: "email",
  };

  const submitRes = await fetch(`${BASE_URL}/api/quote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newQuotePayload),
  });
  const submitData = await submitRes.json();

  assert(submitRes.status === 201, "POST /api/quote returns 201 Created");
  assert(submitData.success === true, "Quote response includes confirmation success");
  const createdQuoteId = submitData.data?.id;
  assert(!!createdQuoteId, `Quote saved with ID: ${createdQuoteId}`);

  // TEST 8: Verify quote appears in admin dashboard with status 'new'
  console.log("\n8. Testing Quote Appearance in Admin Dashboard...");
  const verifyQuotesRes = await fetch(`${BASE_URL}/api/admin/quotes`, { headers: adminAuthHeaders });
  const verifyQuotesData = await verifyQuotesRes.json();
  const foundQuote = verifyQuotesData.data?.find(
    (q) => q.id === createdQuoteId || q.email === newQuotePayload.email
  );

  assert(!!foundQuote, "Newly submitted quote is visible in Admin Quotes dashboard list");
  assert(foundQuote?.status === "new", "Quote default status is 'new'");

  // TEST 9: Status change: new -> contacted -> completed
  console.log("\n9. Testing Status Transitions (new -> contacted -> completed)...");
  const contactedRes = await fetch(`${BASE_URL}/api/admin/quotes/${createdQuoteId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...adminAuthHeaders },
    body: JSON.stringify({ status: "contacted" }),
  });
  const contactedData = await contactedRes.json();
  assert(contactedData.data?.status === "contacted", "Quote status successfully transitioned to 'contacted'");

  const completedRes = await fetch(`${BASE_URL}/api/admin/quotes/${createdQuoteId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...adminAuthHeaders },
    body: JSON.stringify({ status: "completed" }),
  });
  const completedData = await completedRes.json();
  assert(completedData.data?.status === "completed", "Quote status successfully transitioned to 'completed'");

  // TEST 10: Save internal notes and delete quote
  console.log("\n10. Testing Staff Notes & Deletion...");
  const notesRes = await fetch(`${BASE_URL}/api/admin/quotes/${createdQuoteId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...adminAuthHeaders },
    body: JSON.stringify({ notes: "Site inspection scheduled for Friday 9:00 AM." }),
  });
  const notesData = await notesRes.json();
  assert(notesData.data?.notes?.includes("Site inspection scheduled"), "Staff internal notes saved");

  const deleteRes = await fetch(`${BASE_URL}/api/admin/quotes/${createdQuoteId}`, {
    method: "DELETE",
    headers: adminAuthHeaders,
  });
  const deleteData = await deleteRes.json();
  assert(deleteData.success === true, "Quote successfully deleted/archived");

  // TEST 11: Logout API
  console.log("\n11. Testing Logout API (/api/auth/logout)...");
  const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: "POST",
    headers: adminAuthHeaders,
  });
  assert(logoutRes.status === 200, "POST /api/auth/logout returns 200");

  console.log("\n==================================================================");
  console.log(` MASTER VERIFICATION RESULTS: ${passed}/${total} TESTS PASSED `);
  console.log("==================================================================");

  if (passed === total) {
    console.log("\n✨ ALL MASTER AUTH & QUOTES TESTS PASSED WITH 100% SUCCESS!");
  } else {
    process.exit(1);
  }
}

runMasterVerification().catch((err) => {
  console.error("Master verification failure:", err);
  process.exit(1);
});
