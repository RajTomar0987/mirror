const BASE_URL = "http://localhost:3000";

async function runMasterVerification() {
  console.log("==================================================================");
  console.log(" MASTER VERIFICATION: AUTHENTICATION + ROLE-BASED ACCESS + QUOTES ");
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

  // TEST 1: Unauthenticated access to /admin/quotes is protected
  console.log("1. Testing Unauthenticated Route Protection...");
  const unauthApiRes = await fetch(`${BASE_URL}/api/admin/quotes`);
  assert(unauthApiRes.status === 401, "GET /api/admin/quotes without token returns 401 Unauthorized");

  // TEST 2: Invalid login credentials returns 401
  console.log("\n2. Testing Invalid Login Credentials...");
  const invalidLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "nonexistent.user@randomdomain.com",
      password: "WrongPassword999!",
    }),
  });
  const invalidLoginData = await invalidLoginRes.json();
  assert(invalidLoginRes.status === 401, "POST /api/auth/login with wrong credentials returns 401");
  assert(invalidLoginData.error === "Invalid email or password.", "401 error message is clean user-facing 'Invalid email or password.'");

  // TEST 3: Public sign up flow
  console.log("\n3. Testing Public Sign Up Flow (/auth?mode=signup)...");
  const testUserEmail = `client.${Date.now()}@domain.com`;
  const signupRes = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: "Raj Singh Tomar",
      email: testUserEmail,
      password: "UserPassword123!",
      confirmPassword: "UserPassword123!",
    }),
  });
  const signupData = await signupRes.json();

  assert(signupRes.status === 201, "POST /api/auth/signup returns 201 Created");
  assert(signupData.success === true, "Signup returns success: true");
  assert(signupData.data?.role === "user", "Normal public signup ALWAYS receives role='user'");
  assert(signupData.data?.name === "Raj Singh Tomar", "Signup returns user's name");

  // TEST 4: Login as normal user
  console.log("\n4. Testing Normal User Login (/auth?mode=login)...");
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

  assert(userLoginRes.status === 200, "POST /api/auth/login with valid user credentials returns 200");
  assert(userLoginData.data?.user?.role === "user", "Logged in user verified as role='user'");
  assert(userLoginData.data?.user?.name === "Raj Singh Tomar", "Logged in user returns correct name");
  assert(!!userToken, "User receives valid session access_token");

  // TEST 5: Normal user attempt to access /api/admin/quotes MUST be rejected
  console.log("\n5. Testing Access Control (Normal user cannot access admin quotes)...");
  const userAdminAttemptRes = await fetch(`${BASE_URL}/api/admin/quotes`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  assert(
    userAdminAttemptRes.status === 401 || userAdminAttemptRes.status === 403,
    "GET /api/admin/quotes as normal user returns 401/403 Access Denied"
  );

  // TEST 6: User Logout
  console.log("\n6. Testing User Logout (/api/auth/logout)...");
  const userLogoutRes = await fetch(`${BASE_URL}/api/auth/logout`, { method: "POST" });
  assert(userLogoutRes.status === 200, "POST /api/auth/logout returns 200");

  // TEST 7: Administrator Login
  console.log("\n7. Testing Administrator Login (/auth?mode=login)...");
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
  assert(adminLoginData.data?.user?.role === "admin", "Admin user verified as role='admin'");
  assert(!!adminToken, "Admin receives valid admin session token");

  const adminAuthHeaders = {
    Authorization: `Bearer ${adminToken}`,
    Cookie: adminCookie || `cgi_admin_session=${adminToken}`,
  };

  // TEST 8: Admin Dashboard Access & Quote List
  console.log("\n8. Testing Admin Quotes Dashboard Access...");
  const adminQuotesRes = await fetch(`${BASE_URL}/api/admin/quotes`, { headers: adminAuthHeaders });
  const adminQuotesData = await adminQuotesRes.json();

  assert(adminQuotesRes.status === 200, "GET /api/admin/quotes with admin token returns 200");
  assert(Array.isArray(adminQuotesData.data), "GET /api/admin/quotes returns quote requests array");

  // TEST 9: Public Quote Form Submission
  console.log("\n9. Testing Public Quote Form Submission (/quote -> /api/quote)...");
  const newQuotePayload = {
    name: "Architectural Client Enquiry",
    email: "client.enquiry@sydneyglass.com.au",
    phone: "0412 345 678",
    suburb: "Double Bay, NSW",
    service: "Glass Balustrades",
    description: "12m of frameless 15mm architectural balustrade with stainless hardware.",
    preferredContact: "email",
  };

  const submitRes = await fetch(`${BASE_URL}/api/quote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newQuotePayload),
  });
  const submitData = await submitRes.json();

  assert(submitRes.status === 201, "POST /api/quote returns 201 Created");
  assert(submitData.success === true, "Quote submission confirmation returned");
  const createdQuoteId = submitData.data?.id;
  assert(!!createdQuoteId, `Quote saved with ID: ${createdQuoteId}`);

  // TEST 10: Verify new quote appears in admin dashboard with status 'new'
  console.log("\n10. Testing Quote Appearance in Admin Dashboard...");
  const verifyQuotesRes = await fetch(`${BASE_URL}/api/admin/quotes`, { headers: adminAuthHeaders });
  const verifyQuotesData = await verifyQuotesRes.json();
  const foundQuote = verifyQuotesData.data?.find(
    (q) => q.id === createdQuoteId || q.email === newQuotePayload.email
  );

  assert(!!foundQuote, "Newly submitted quote is visible in Admin Quotes dashboard");
  assert(foundQuote?.status === "new", "Quote initial status is 'new'");

  // TEST 11: Status transitions: new -> contacted -> completed
  console.log("\n11. Testing Status Transitions (new -> contacted -> completed)...");
  const contactedRes = await fetch(`${BASE_URL}/api/admin/quotes/${createdQuoteId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...adminAuthHeaders },
    body: JSON.stringify({ status: "contacted" }),
  });
  const contactedData = await contactedRes.json();
  assert(contactedData.data?.status === "contacted", "Status updated to 'contacted'");

  const completedRes = await fetch(`${BASE_URL}/api/admin/quotes/${createdQuoteId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...adminAuthHeaders },
    body: JSON.stringify({ status: "completed" }),
  });
  const completedData = await completedRes.json();
  assert(completedData.data?.status === "completed", "Status updated to 'completed'");

  // TEST 12: Internal Notes & Quote Deletion
  console.log("\n12. Testing Internal Staff Notes & Deletion...");
  const notesRes = await fetch(`${BASE_URL}/api/admin/quotes/${createdQuoteId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...adminAuthHeaders },
    body: JSON.stringify({ notes: "Site inspection booked for Tuesday 10:00 AM." }),
  });
  const notesData = await notesRes.json();
  assert(notesData.data?.notes?.includes("Site inspection booked"), "Internal staff notes saved successfully");

  const deleteRes = await fetch(`${BASE_URL}/api/admin/quotes/${createdQuoteId}`, {
    method: "DELETE",
    headers: adminAuthHeaders,
  });
  const deleteData = await deleteRes.json();
  assert(deleteData.success === true, "Quote successfully deleted/archived");

  // TEST 13: Admin Logout & Protection Confirmation
  console.log("\n13. Testing Admin Logout & Re-protection...");
  const adminLogoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: "POST",
    headers: adminAuthHeaders,
  });
  assert(adminLogoutRes.status === 200, "POST /api/auth/logout returns 200");

  const recheckRes = await fetch(`${BASE_URL}/api/admin/quotes`);
  assert(recheckRes.status === 401, "GET /api/admin/quotes after logout returns 401 Unauthorized");

  console.log("\n==================================================================");
  console.log(` MASTER VERIFICATION RESULTS: ${passed}/${total} TESTS PASSED `);
  console.log("==================================================================");

  if (passed === total) {
    console.log("\n✨ ALL MASTER AUTH, ADMIN, & QUOTES TESTS PASSED WITH 100% SUCCESS!");
  } else {
    process.exit(1);
  }
}

runMasterVerification().catch((err) => {
  console.error("Master verification failure:", err);
  process.exit(1);
});
