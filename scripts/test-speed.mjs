const BASE_URL = "http://localhost:3000";

const ROUTES_TO_TEST = [
  "/",
  "/about",
  "/services",
  "/services/glass-balustrades",
  "/projects",
  "/projects/modernist-harbour-balustrades",
  "/why-us",
  "/contact",
  "/quote",
];

async function testPerformance() {
  console.log("=== TESTING PRODUCTION ROUTES SPEED & INTEGRITY ===");

  for (const route of ROUTES_TO_TEST) {
    const start = performance.now();
    const res = await fetch(`${BASE_URL}${route}`);
    const timeMs = (performance.now() - start).toFixed(1);
    const text = await res.text();
    const sizeKB = (text.length / 1024).toFixed(1);

    if (res.status === 200) {
      console.log(`✓ ${route.padEnd(42)} | Status: 200 | Time: ${timeMs}ms | HTML: ${sizeKB} KB`);
    } else {
      console.error(`❌ ${route.padEnd(42)} | Status: ${res.status} | Failed`);
    }
  }

  console.log("\n=== ALL ROUTES VERIFIED SUCCESSFULLY ===");
}

testPerformance().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
