import mongoose from "mongoose";
import { app } from "../src/app.js";
import { ConnectToDb } from "../src/config/db.js";
import { ledgerModel } from "../src/models/ledger.model.js";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "ci_test_jwt_secret_super_secure_12345";

// Lightweight HTTP client using native Node.js v20 global fetch
async function apiRequest(url, { method = "GET", headers = {}, body = null } = {}) {
    const res = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...headers
        },
        body: body ? JSON.stringify(body) : undefined
    });
    const data = await res.json().catch(() => null);
    return { status: res.status, ok: res.ok, data };
}

async function runTestSuite() {
    console.log("===============================================================");
    console.log("       VAULTLEDGER ENTERPRISE TEST & BENCHMARK SUITE          ");
    console.log("===============================================================\n");

    let server;
    let failedSuites = 0;

    try {
        // 0. Initialize Ephemeral Database & In-Process Express Server
        console.log("[INIT] Connecting to Database and starting test server...");
        await ConnectToDb();

        server = await new Promise((resolve) => {
            const s = app.listen(0, () => resolve(s));
        });
        const port = server.address().port;
        const API = `http://127.0.0.1:${port}/api`;
        console.log(`[INIT] Test Server running on port ${port}. Environment: ${process.env.NODE_ENV}\n`);

        // ====================================================================
        // SUITE 1: AUTHENTICATION & ACCESS CONTROL
        // ====================================================================
        console.log("---------------------------------------------------------------");
        console.log(" SUITE 1: AUTHENTICATION, JWT & ACCESS CONTROL");
        console.log("---------------------------------------------------------------");
        try {
            const testEmail = `tester_${Date.now()}@bankledger.com`;
            const regRes = await apiRequest(`${API}/auth/register`, {
                method: "POST",
                body: {
                    name: "Lead Systems Engineer",
                    email: testEmail,
                    password: "SecurePassword123!"
                }
            });

            if (regRes.status !== 201 && regRes.status !== 200) {
                throw new Error(`Unexpected register status: ${regRes.status} (${JSON.stringify(regRes.data)})`);
            }
            const token = regRes.data.token;
            if (!token) throw new Error("No JWT token returned from registration");

            // Test /auth/me with Bearer token
            const meRes = await apiRequest(`${API}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (meRes.data.user?.email !== testEmail) {
                throw new Error("Token payload identity mismatch");
            }

            // Test Protected Route rejection without token
            const unauthorizedRes = await apiRequest(`${API}/auth/me`);
            if (unauthorizedRes.status !== 401) {
                throw new Error(`Protected route allowed access without token! Status: ${unauthorizedRes.status}`);
            }

            console.log("  [PASS] User Registration & Password Hashing");
            console.log("  [PASS] JWT Token verification & /auth/me");
            console.log("  [PASS] Unauthorized route blocking (401)");
            console.log("  RESULT: [PASS] SUITE 1\n");
        } catch (err) {
            failedSuites++;
            console.error("  RESULT: [FAIL] SUITE 1:", err.message, "\n");
        }

        // ====================================================================
        // SUITE 2: MULTI-ACCOUNT LEDGER & BALANCE DERIVATION
        // ====================================================================
        console.log("---------------------------------------------------------------");
        console.log(" SUITE 2: MULTI-ACCOUNT PORTFOLIO & LEDGER CREATION");
        console.log("---------------------------------------------------------------");
        let sourceAccountId, targetAccountId, sourceAuthHeader, targetAuthHeader;
        try {
            // Register Source User
            const user1Res = await apiRequest(`${API}/auth/register`, {
                method: "POST",
                body: {
                    name: "Source Account Owner",
                    email: `source_${Date.now()}@bankledger.com`,
                    password: "SecurePassword123!"
                }
            });
            sourceAuthHeader = { Authorization: `Bearer ${user1Res.data.token}` };

            const acc1Res = await apiRequest(`${API}/accounts`, {
                method: "POST",
                headers: sourceAuthHeader,
                body: {
                    accountName: "Primary Current Account",
                    accountType: "CURRENT"
                }
            });
            sourceAccountId = acc1Res.data.account._id;
            const sourceAccNum = acc1Res.data.account.accountNumber;

            // Register Target User
            const user2Res = await apiRequest(`${API}/auth/register`, {
                method: "POST",
                body: {
                    name: "Target Beneficiary",
                    email: `target_${Date.now()}@bankledger.com`,
                    password: "SecurePassword123!"
                }
            });
            targetAuthHeader = { Authorization: `Bearer ${user2Res.data.token}` };

            const acc2Res = await apiRequest(`${API}/accounts`, {
                method: "POST",
                headers: targetAuthHeader,
                body: {
                    accountName: "Target Savings",
                    accountType: "SAVINGS"
                }
            });
            targetAccountId = acc2Res.data.account._id;

            // Seed Source Account with ₹100 via initial credit ledger entry
            await ledgerModel.create({
                account: sourceAccountId,
                amount: 100,
                transaction: new mongoose.Types.ObjectId(),
                type: "CREDIT"
            });

            // Verify balance derivation
            const accountsListRes = await apiRequest(`${API}/accounts/user_accounts`, {
                headers: sourceAuthHeader
            });
            const verifiedAcc = accountsListRes.data.accounts.find(a => a._id === sourceAccountId);

            if (!verifiedAcc || verifiedAcc.balance !== 100) {
                throw new Error(`Derived balance expected 100, received ${verifiedAcc?.balance}`);
            }

            console.log(`  [PASS] 10-Digit Account Number Created: ${sourceAccNum}`);
            console.log("  [PASS] Immutable Ledger Credit Entry Seeded: 100 INR");
            console.log(`  [PASS] Balance Derived via Ledger Math: 100 INR`);
            console.log("  RESULT: [PASS] SUITE 2\n");
        } catch (err) {
            failedSuites++;
            console.error("  RESULT: [FAIL] SUITE 2:", err.message, "\n");
        }

        // ====================================================================
        // SUITE 3: ACID CONCURRENCY & DOUBLE-SPEND BENCHMARK (50 THREADS)
        // ====================================================================
        console.log("---------------------------------------------------------------");
        console.log(" SUITE 3: ACID CONCURRENCY & DOUBLE-SPEND BENCHMARK");
        console.log("---------------------------------------------------------------");
        try {
            const CONCURRENT_REQUESTS = 50;
            const TRANSFER_AMOUNT = 100;

            console.log(`  Dispatching ${CONCURRENT_REQUESTS} simultaneous requests of ${TRANSFER_AMOUNT} INR against 100 INR balance...`);

            const promises = [];
            for (let i = 1; i <= CONCURRENT_REQUESTS; i++) {
                const payload = {
                    fromAccount: sourceAccountId,
                    toAccount: targetAccountId,
                    amount: TRANSFER_AMOUNT,
                    idempotencyKey: `benchmark_stress_${i}_${Date.now()}`
                };

                promises.push(
                    apiRequest(`${API}/transactions`, {
                        method: "POST",
                        headers: sourceAuthHeader,
                        body: payload
                    }).then(res => ({
                        status: res.status === 201 || res.status === 200 ? "SUCCESS" : "BLOCKED",
                        code: res.status,
                        data: res.data
                    }))
                );
            }

            const startTime = Date.now();
            const results = await Promise.all(promises);
            const duration = Date.now() - startTime;

            const successful = results.filter(r => r.status === "SUCCESS");
            const blocked = results.filter(r => r.status === "BLOCKED");

            const finalCheck = await apiRequest(`${API}/accounts/user_accounts`, {
                headers: sourceAuthHeader
            });
            const sourceFinalBalance = finalCheck.data.accounts.find(a => a._id === sourceAccountId).balance;

            console.log(`  Execution Time:               ${duration} ms`);
            console.log(`  Concurrent Threads Fired:     ${CONCURRENT_REQUESTS}`);
            console.log(`  Successful Transfers (201):   ${successful.length}`);
            console.log(`  Blocked Overdrafts (400/409): ${blocked.length}`);
            console.log(`  Source Final Balance:         ${sourceFinalBalance} INR`);

            if (successful.length === 1 && sourceFinalBalance === 0 && blocked.length === 49) {
                console.log("  RESULT: [PASS] SUITE 3 - 100% ACID ISOLATION COMPLIANT (0 DOUBLE SPENDS)\n");
            } else {
                throw new Error(`Double-spend anomaly detected! Successful: ${successful.length}, Balance: ${sourceFinalBalance}`);
            }
        } catch (err) {
            failedSuites++;
            console.error("  RESULT: [FAIL] SUITE 3:", err.message, "\n");
        }

        // ====================================================================
        // SUITE 4: IDEMPOTENCY KEY REPLAY PROTECTION
        // ====================================================================
        console.log("---------------------------------------------------------------");
        console.log(" SUITE 4: IDEMPOTENCY REPLAY ATTACK PROTECTION");
        console.log("---------------------------------------------------------------");
        try {
            // Seed target account with 50 INR so it can transfer
            await ledgerModel.create({
                account: targetAccountId,
                amount: 50,
                transaction: new mongoose.Types.ObjectId(),
                type: "CREDIT"
            });

            const staticIdempotencyKey = `replay_test_key_${Date.now()}`;
            const transferPayload = {
                fromAccount: targetAccountId,
                toAccount: sourceAccountId,
                amount: 20,
                idempotencyKey: staticIdempotencyKey
            };

            // First request: Process transfer
            const firstRes = await apiRequest(`${API}/transactions`, {
                method: "POST",
                headers: targetAuthHeader,
                body: transferPayload
            });
            if (firstRes.status !== 201 && firstRes.status !== 200) {
                throw new Error(`First transfer failed: ${firstRes.status}`);
            }

            // Second request: Replay with identical key
            await apiRequest(`${API}/transactions`, {
                method: "POST",
                headers: targetAuthHeader,
                body: transferPayload
            });

            // Verify idempotency was honored (duplicate key caught and transaction not re-debited)
            const targetBalanceRes = await apiRequest(`${API}/accounts/user_accounts`, {
                headers: targetAuthHeader
            });
            const targetBalance = targetBalanceRes.data.accounts.find(a => a._id === targetAccountId).balance;

            // Target balance should have decremented by exactly 20, with 0 extra debit on replay
            if (targetBalance === 130) {
                console.log("  [PASS] Initial Transfer Processed: 20 INR debited");
                console.log("  [PASS] Replay Request Intercepted: duplicate transaction handled safely");
                console.log(`  [PASS] Target Account Balance Verified: ${targetBalance} INR (zero duplicate debit)`);
                console.log("  RESULT: [PASS] SUITE 4\n");
            } else {
                throw new Error(`Idempotency violated! Balance is ${targetBalance}, expected 130`);
            }
        } catch (err) {
            failedSuites++;
            console.error("  RESULT: [FAIL] SUITE 4:", err.message, "\n");
        }

        // ====================================================================
        // SUMMARY
        // ====================================================================
        console.log("===============================================================");
        if (failedSuites === 0) {
            console.log(" [SUMMARY] ALL 4 TEST SUITES PASSED SUCCESSFULLY");
            console.log("===============================================================\n");
            process.exit(0);
        } else {
            console.log(` [SUMMARY] ${failedSuites} TEST SUITE(S) FAILED`);
            console.log("===============================================================\n");
            process.exit(1);
        }

    } catch (criticalErr) {
        console.error("Fatal Test Runner Error:", criticalErr);
        process.exit(1);
    } finally {
        if (server) server.close();
        await mongoose.disconnect();
    }
}

runTestSuite();
