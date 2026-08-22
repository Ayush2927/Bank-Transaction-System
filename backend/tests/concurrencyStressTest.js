import axios from "axios";

/**
 * CONCURRENCY & DOUBLE-SPEND STRESS TEST SUITE
 * -------------------------------------------
 * This script empirically benchmarks the isolation guarantees of our session-scoped
 * MongoDB WiredTiger transactions by firing 50 simultaneous transfer requests at the 
 * exact same millisecond against an account with a fixed $100 balance.
 */

const API_BASE_URL = "http://localhost:8000/api";

async function runConcurrencyStressTest() {
    console.log("==========================================================");
    console.log("🚀 STARTING CONCURRENCY & DOUBLE-SPEND STRESS TEST SUITE");
    console.log("==========================================================\n");

    try {
        // 1. Authenticate / Register Test User
        const testEmail = `stresstest_${Date.now()}@bankledger.com`;
        const testPassword = "Password123!";

        console.log(`[1/4] Registering test user: ${testEmail}...`);
        const regRes = await axios.post(`${API_BASE_URL}/auth/register`, {
            name: "Concurrency Test User",
            email: testEmail,
            password: testPassword
        });

        const token = regRes.data.token;
        const authHeaders = { headers: { Authorization: `Bearer ${token}` } };
        console.log("✅ User registered & authenticated successfully.\n");

        // 2. Create Initial Source Account ($100 Balance) & Destination Account ($0 Balance)
        console.log("[2/4] Creating Source Account ($100 Initial Balance) & Target Account ($0)...");
        const sourceAccRes = await axios.post(`${API_BASE_URL}/accounts`, { initialBalance: 100 }, authHeaders);
        const sourceAccountId = sourceAccRes.data.account._id;

        // Register second user for target account
        const targetEmail = `target_${Date.now()}@bankledger.com`;
        const targetRegRes = await axios.post(`${API_BASE_URL}/auth/register`, {
            name: "Target User",
            email: targetEmail,
            password: testPassword
        });
        const targetToken = targetRegRes.data.token;
        const targetAccRes = await axios.post(`${API_BASE_URL}/accounts`, { initialBalance: 0 }, { headers: { Authorization: `Bearer ${targetToken}` } });
        const targetAccountId = targetAccRes.data.account._id;

        console.log(`✅ Source Account Created: ID ${sourceAccountId} (Balance: $100)`);
        console.log(`✅ Target Account Created: ID ${targetAccountId} (Balance: $0)\n`);

        // 3. Fire 50 SIMULTANEOUS TRANSFER REQUESTS at the exact same millisecond ($100 each)
        const CONCURRENT_REQUESTS = 50;
        const TRANSFER_AMOUNT = 100;

        console.log(`[3/4] Firing ${CONCURRENT_REQUESTS} SIMULTANEOUS $${TRANSFER_AMOUNT} Transfer Requests using Promise.all()...`);

        const promises = [];
        for (let i = 1; i <= CONCURRENT_REQUESTS; i++) {
            const idempotencyKey = `stress_key_${i}_${Date.now()}`;
            const transferPayload = {
                fromAccountId: sourceAccountId,
                toAccountId: targetAccountId,
                amount: TRANSFER_AMOUNT,
                idempotencyKey
            };

            // Push promises into array for simultaneous dispatch
            promises.push(
                axios.post(`${API_BASE_URL}/transactions/transfer`, transferPayload, authHeaders)
                    .then(res => ({ status: "SUCCESS", code: res.status, data: res.data }))
                    .catch(err => ({ status: "FAILED", code: err.response?.status || 500, error: err.response?.data?.message || err.message }))
            );
        }

        const startTime = Date.now();
        const results = await Promise.all(promises);
        const duration = Date.now() - startTime;

        // 4. Analyze Results
        const successfulTransfers = results.filter(r => r.status === "SUCCESS");
        const failedTransfers = results.filter(r => r.status === "FAILED");

        console.log("\n==========================================================");
        console.log("📊 EMPIRICAL STRESS TEST RESULTS & VERIFICATION BENCHMARK");
        console.log("==========================================================");
        console.log(`⏱️ Execution Time:             ${duration} ms`);
        console.log(`📡 Total Concurrent Threads:   ${CONCURRENT_REQUESTS}`);
        console.log(`✅ Successful Transfers (200):  ${successfulTransfers.length}`);
        console.log(`🛑 Blocked Overdrafts (400/409): ${failedTransfers.length}`);

        // 5. Final Verification Query
        const finalSourceRes = await axios.get(`${API_BASE_URL}/accounts`, authHeaders);
        const finalBalance = finalSourceRes.data.accounts.find(a => a._id === sourceAccountId).balance;

        console.log(`\n💰 Source Account Final Balance: $${finalBalance}`);

        if (successfulTransfers.length === 1 && finalBalance === 0) {
            console.log("\n🎉 CONCURRENCY TEST PASSED! 100% ACID ISOLATION COMPLIANT (ZERO DOUBLE-SPEND DISCREPANCY).");
        } else {
            console.log("\n❌ CONCURRENCY TEST FAILED! Double-spend anomaly detected.");
        }
        console.log("==========================================================\n");

    } catch (error) {
        console.error("Test execution failed:", error.response?.data || error.message);
    }
}

runConcurrencyStressTest();
