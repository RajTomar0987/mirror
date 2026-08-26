const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("==================================================");
  console.log(" COMPLETE ADMIN AUTH & QUOTES VERIFICATION SUITE ");
  console.log("==================================================\n");

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

  // TEST 1: Unauthorized access to /api/admin/quotes must return 401
  console.log("1. Testing Unauthorized Access Protection...");
  const unauthRes = await fetch(`${BASE_URL}/api/admin/quotes`);
  assert(unauthRes.status === 401, "GET /api/admin/quotes without token returns 401 Unauthorized");

  // TEST 2: Login with invalid credentials must return 401
  console.log("\n2. Testing Invalid Credentials Rejection...");
  const invalidLoginRes = await fetch(`${BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "invalid@test.com", password: "wrongpassword" }),
  });
  assert(invalidLoginRes.status === 401, "POST /api/admin/login with invalid credentials returns 401");

  // TEST 3: Login with valid admin credentials returns token and sets cookie
  console.log("\n3. Testing Successful Admin Authentication...");
  const validLoginRes = await fetch(`${BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@completeglass.com.au", password: "adminpass123" }),
  });
  const validLoginData = await validLoginRes.json();
  const token = validLoginData?.data?.access_token;
  const cookie = validLoginRes.headers.get("set-cookie");

  assert(validLoginRes.status === 200, "POST /api/admin/login with admin credentials returns 200");
  assert(validLoginData?.success === true, "Login response contains success: true");
  assert(!!token, "Login response contains access_token");

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    Cookie: cookie || `cgi_admin_session=${token}`,
  };

  // TEST 4: Authorized access to /api/admin/quotes returns 200 and array
  console.log("\n4. Testing Protected Quotes Dashboard Data Access...");
  const quotesRes = await fetch(`${BASE_URL}/api/admin/quotes`, { headers: authHeaders });
  const quotesData = await quotesRes.json();

  assert(quotesRes.status === 200, "GET /api/admin/quotes with valid token returns 200");
  assert(Array.isArray(quotesData.data), "GET /api/admin/quotes returns an array of quotes");

  // TEST 5: Public quote submission via /api/quote
  console.log("\n5. Testing Public Quote Submission Flow...");
  const testQuotePayload = {
    name: "Architectural Test Client",
    email: "client.test@architecture.com.au",
    phone: "0412 345 678",
    suburb: "Vaucluse, NSW",
    service: "Glass Balustrades",
    description: "Frameless 15mm glass balustrade installation for coastal residence.",
    preferredContact: "email",
  };

  const submitRes = await fetch(`${BASE_URL}/api/quote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(testQuotePayload),
  });
  const submitData = await submitRes.json();

  assert(submitRes.status === 201, "POST /api/quote returns 201 Created");
  assert(submitData?.success === true, "POST /api/quote returns success message");
  const createdQuoteId = submitData?.data?.id;
  assert(!!createdQuoteId, `Quote created with ID: ${createdQuoteId}`);

  // TEST 6: Verify newly submitted quote appears in admin quotes list
  console.log("\n6. Testing Quote Visibility in Admin Dashboard...");
  const updatedQuotesRes = await fetch(`${BASE_URL}/api/admin/quotes`, { headers: authHeaders });
  const updatedQuotesData = await updatedQuotesRes.json();
  const foundQuote = updatedQuotesData.data?.find((q) => q.id === createdQuoteId || q.email === testQuotePayload.email);

  assert(!!foundQuote, "Newly submitted quote is visible in Admin Quotes dashboard list");
  assert(foundQuote?.status === "new", "Newly submitted quote has default status 'new'");

  // TEST 7: Update quote status to 'contacted'
  console.log("\n7. Testing Quote Status Transition ('new' -> 'contacted')...");
  const statusUpdateRes = await fetch(`${BASE_URL}/api/admin/quotes/${createdQuoteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
    },
    body: JSON.stringify({ status: "contacted" }),
  });
  const statusUpdateData = await statusUpdateRes.json();

  assert(statusUpdateRes.status === 200, "PATCH /api/admin/quotes/[id] returns 200");
  assert(statusUpdateData?.data?.status === "contacted", "Quote status successfully changed to 'contacted'");

  // TEST 8: Save internal staff notes on quote
  console.log("\n8. Testing Internal Staff Notes Persistence...");
  const notesUpdateRes = await fetch(`${BASE_URL}/api/admin/quotes/${createdQuoteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
    },
    body: JSON.stringify({ notes: "Site measurement scheduled for Monday 10:00 AM with client." }),
  });
  const notesUpdateData = await notesUpdateRes.json();

  assert(notesUpdateRes.status === 200, "PATCH /api/admin/quotes/[id] notes returns 200");
  assert(
    notesUpdateData?.data?.notes?.includes("Site measurement scheduled"),
    "Internal staff notes successfully stored"
  );

  // TEST 9: Delete/Archive quote
  console.log("\n9. Testing Quote Deletion...");
  const deleteRes = await fetch(`${BASE_URL}/api/admin/quotes/${createdQuoteId}`, {
    method: "DELETE",
    headers: authHeaders,
  });
  const deleteData = await deleteRes.json();

  assert(deleteRes.status === 200, "DELETE /api/admin/quotes/[id] returns 200");
  assert(deleteData?.success === true, "Delete response contains success: true");

  // TEST 10: Logout API
  console.log("\n10. Testing Admin Logout Flow...");
  const logoutRes = await fetch(`${BASE_URL}/api/admin/logout`, {
    method: "POST",
    headers: authHeaders,
  });
  assert(logoutRes.status === 200, "POST /api/admin/logout returns 200");

  console.log("\n==================================================");
  console.log(` RESULTS: ${passed}/${total} TESTS PASSED `);
  console.log("==================================================");

  if (passed === total) {
    console.log("\n✨ ALL ADMIN AUTHENTICATION & QUOTES TESTS PASSED PERFECTLY!");
  } else {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failure:", err);
  process.exit(1);
});
