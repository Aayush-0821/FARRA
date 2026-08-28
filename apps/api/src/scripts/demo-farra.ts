import "dotenv/config";
import { prisma } from "../lib/prisma.js";

const DEMO_MERCHANT_NAME =
  "FAARRA Demo Merchant";

const DEMO_MERCHANT_EMAIL =
  "demo@farra.local";

const DEMO_RAZORPAY_ACCOUNT_ID =
  "acc_farra_demo_001"; 

async function main() {
  console.log("\n🌱 Starting FAARRA demo seed...\n");

const merchant =
  await prisma.merchant.upsert({
    where: {
      razorpayAccountId:
        DEMO_RAZORPAY_ACCOUNT_ID,
    },

    update: {
      name: DEMO_MERCHANT_NAME,
      email: DEMO_MERCHANT_EMAIL,
      currency: "INR",
      status: "ACTIVE",
    },

    create: {
      name: DEMO_MERCHANT_NAME,
      email: DEMO_MERCHANT_EMAIL,
      razorpayAccountId:
        DEMO_RAZORPAY_ACCOUNT_ID,
      currency: "INR",
      status: "ACTIVE",
    },
  });

  console.log(
    `✅ Merchant: ${merchant.name}`,
  );

  const customer1 =
    await prisma.customer.upsert({
      where: {
        merchantId_razorpayCustomerId: {
          merchantId: merchant.id,
          razorpayCustomerId:
            "cust_farra_001",
        },
      },
      update: {},
      create: {
        merchantId: merchant.id,
        razorpayCustomerId:
          "cust_farra_001",
        name: "Rahul Sharma",
        email: "rahul.demo@farra.local",
        phone: "+919876540001",
        preferredLanguage: "HINGLISH",
      },
    });

  const customer2 =
    await prisma.customer.upsert({
      where: {
        merchantId_razorpayCustomerId: {
          merchantId: merchant.id,
          razorpayCustomerId:
            "cust_farra_002",
        },
      },
      update: {},
      create: {
        merchantId: merchant.id,
        razorpayCustomerId:
          "cust_farra_002",
        name: "Priya Verma",
        email: "priya.demo@farra.local",
        phone: "+919876540002",
        preferredLanguage: "ENGLISH",
      },
    });

  const customer3 =
    await prisma.customer.upsert({
      where: {
        merchantId_razorpayCustomerId: {
          merchantId: merchant.id,
          razorpayCustomerId:
            "cust_farra_003",
        },
      },
      update: {},
      create: {
        merchantId: merchant.id,
        razorpayCustomerId:
          "cust_farra_003",
        name: "Aman Gupta",
        email: "aman.demo@farra.local",
        phone: "+919876540003",
        preferredLanguage: "HINDI",
      },
    });

  console.log("✅ 3 demo customers created");

  const payments = [
    {
      razorpayPaymentId:
        "pay_farra_demo_success_001",
      customerId: customer1.id,
      amount: "999",
      status: "CAPTURED" as const,
      method: "upi",
      failureCode: null,
      failureReason: null,
    },

    {
      razorpayPaymentId:
        "pay_farra_demo_failed_001",
      customerId: customer2.id,
      amount: "199",
      status: "FAILED" as const,
      method: "upi",
      failureCode: "BAD_REQUEST_ERROR",
      failureReason:
        "Payment failed because the payment method was declined",
    },

    {
      razorpayPaymentId:
        "pay_farra_demo_failed_002",
      customerId: customer3.id,
      amount: "499",
      status: "FAILED" as const,
      method: "card",
      failureCode: "PAYMENT_FAILED",
      failureReason:
        "Bank declined the transaction",
    },

    {
      razorpayPaymentId:
        "pay_farra_demo_failed_003",
      customerId: customer1.id,
      amount: "1499",
      status: "FAILED" as const,
      method: "upi",
      failureCode: "GATEWAY_ERROR",
      failureReason:
        "Temporary payment gateway degradation",
    },

    {
      razorpayPaymentId:
        "pay_farra_demo_refunded_001",
      customerId: customer2.id,
      amount: "799",
      status: "REFUNDED" as const,
      method: "card",
      failureCode: null,
      failureReason: null,
    },
  ];

  const createdPayments = [];

  for (const payment of payments) {
    const created =
      await prisma.payment.upsert({
        where: {
          merchantId_razorpayPaymentId: {
            merchantId: merchant.id,
            razorpayPaymentId:
              payment.razorpayPaymentId,
          },
        },
        update: {},
        create: {
          merchantId: merchant.id,
          customerId: payment.customerId,
          razorpayPaymentId:
            payment.razorpayPaymentId,
          amount: payment.amount,
          currency: "INR",
          status: payment.status,
          method: payment.method,
          failureCode:
            payment.failureCode,
          failureReason:
            payment.failureReason,
        },
      });

    createdPayments.push(created);
  }

  console.log(
    `✅ ${createdPayments.length} demo payments created`,
  );

  const now = new Date();

  const failedPayment =
    createdPayments.find(
      (p) =>
        p.status === "FAILED" &&
        p.razorpayPaymentId ===
          "pay_farra_demo_failed_001",
    );

  const degradedPayment =
    createdPayments.find(
      (p) =>
        p.status === "FAILED" &&
        p.razorpayPaymentId ===
          "pay_farra_demo_failed_003",
    );

  if (!failedPayment || !degradedPayment) {
    throw new Error(
      "Required demo payments were not created",
    );
  }

  const failedPaymentEvent =
    await prisma.revenueEvent.create({
      data: {
        merchantId: merchant.id,

        eventType:
          "PAYMENT_FAILED",

        sourceType:
          "RAZORPAY_TEST",

        sourceId:
          failedPayment.razorpayPaymentId,

        payload: {
          scenario: "payment_failure",

          paymentId:
            failedPayment.razorpayPaymentId,

          customerId:
            failedPayment.customerId,

          amount:
            failedPayment.amount.toString(),

          failureCode:
            failedPayment.failureCode,

          failureReason:
            failedPayment.failureReason,
        },

        status: "PENDING",

        occurredAt: new Date(
          now.getTime() - 30 * 60 * 1000,
        ),
      },
    });

  const degradationEvent =
    await prisma.revenueEvent.create({
      data: {
        merchantId: merchant.id,

        eventType:
          "PAYMENT_DEGRADED",

        sourceType:
          "RAZORPAY_TEST",

        sourceId:
          degradedPayment.razorpayPaymentId,

        payload: {
          scenario:
            "payment_degradation",

          paymentId:
            degradedPayment.razorpayPaymentId,

          customerId:
            degradedPayment.customerId,

          amount:
            degradedPayment.amount.toString(),

          degradationSignal:
            "gateway_latency",

          affectedMethod: "upi",

          failureRate: 0.31,

          averageLatencyMs: 4200,
        },

        status: "PENDING",

        occurredAt: new Date(
          now.getTime() - 15 * 60 * 1000,
        ),
      },
    });

  console.log("✅ Revenue events created");

  const failedPaymentRisk =
    await prisma.revenueRisk.create({
      data: {
        merchantId: merchant.id,

        customerId:
          failedPayment.customerId,

        revenueEventId:
          failedPaymentEvent.id,

        sourceType:
          "PAYMENT",

        sourceId:
          failedPayment.razorpayPaymentId,

        riskType:
          "FAILED_PAYMENT",

        status: "OPEN",

        riskScore: "0.91",

        probability: "0.82",

        amountAtRisk:
          failedPayment.amount,

        expectedLoss:
            (
              Number(
                failedPayment.amount,
              ) * 0.82
            ).toFixed(2),

        currency: "INR",

        detectedAt: new Date(
          now.getTime() - 25 * 60 * 1000,
        ),
      },
    });

  const degradationRisk =
    await prisma.revenueRisk.create({
      data: {
        merchantId: merchant.id,

        customerId:
          degradedPayment.customerId,

        revenueEventId:
          degradationEvent.id,

        sourceType:
          "PAYMENT",

        sourceId:
          degradedPayment.razorpayPaymentId,

        riskType:
          "PAYMENT_DEGRADATION",

        status: "OPEN",

        riskScore: "0.78",

        probability: "0.67",

        amountAtRisk:
          degradedPayment.amount,

        expectedLoss:
            (
              Number(
                degradedPayment.amount,
              ) * 0.67
            ).toFixed(2),

        currency: "INR",

        detectedAt: new Date(
          now.getTime() - 10 * 60 * 1000,
        ),
      },
    });

  console.log("✅ Revenue risks created");

  await prisma.riskSignal.createMany({
    data: [
      {
        revenueRiskId:
          failedPaymentRisk.id,

        signalType:
          "PAYMENT_FAILURE",

        value:
          "Payment declined by bank",

        weight: "0.90",

        source: "Razorpay",
      },

      {
        revenueRiskId:
          failedPaymentRisk.id,

        signalType:
          "CUSTOMER_HISTORY",

        value:
          "Customer has previous successful payments",

        weight: "0.72",

        source: "FAARRA",
      },

      {
        revenueRiskId:
          failedPaymentRisk.id,

        signalType:
          "PAYMENT_METHOD",

        value: "UPI",

        weight: "0.60",

        source: "Razorpay",
      },

      {
        revenueRiskId:
          degradationRisk.id,

        signalType:
          "PAYMENT_FAILURE",

        value:
          "Elevated UPI failure rate",

        weight: "0.82",

        source: "Razorpay",
      },

      {
        revenueRiskId:
          degradationRisk.id,

        signalType:
          "FAILURE_FREQUENCY",

        value:
          "31% payment failure rate",

        weight: "0.88",

        source: "FAARRA",
      },

      {
        revenueRiskId:
          degradationRisk.id,

        signalType:
          "PAYMENT_METHOD",

        value:
          "UPI gateway latency",

        weight: "0.76",

        source: "Razorpay",
      },
    ],
  });

  console.log("✅ Risk signals created");

  const policy =
    await prisma.recoveryPolicy.create({
      data: {
        merchantId: merchant.id,

        name:
          "Default Revenue Recovery Policy",

        maxRetries: 3,

        retryWindowHours: 72,

        maxCommunicationAttempts: 3,

        allowAutoRetry: true,

        allowVoiceRecovery: true,

        escalationThreshold: 3,

        active: true,
      },
    });

  console.log(
    `✅ Recovery policy created: ${policy.name}`,
  );

  const failedAnalysis =
    await prisma.aIAnalysis.create({
      data: {
        revenueRiskId:
          failedPaymentRisk.id,

        model:
          "farra-demo-diagnosis-v1",

        promptVersion:
          "v1",

        input: {
          paymentId:
            failedPayment.razorpayPaymentId,

          amount:
            failedPayment.amount.toString(),

          failureCode:
            failedPayment.failureCode,

          failureReason:
            failedPayment.failureReason,
        },

        analysis: {
          diagnosis:
            "Payment failure appears to be a temporary payment-method or bank-side decline.",

          rootCause:
            "Bank/payment-method rejection",

          customerIntent:
            "Customer has previously completed payments successfully.",

          recoveryLikelihood: 0.82,

          recommendedStrategy:
            "RETRY_PAYMENT",

          recommendedChannel:
            "PAYMENT_API",

          reasoning:
            "The customer has payment history and the amount is moderate. A bounded retry is preferable to escalation.",
        },

        confidence: "0.91",
      },
    });

  const degradationAnalysis =
    await prisma.aIAnalysis.create({
      data: {
        revenueRiskId:
          degradationRisk.id,

        model:
          "farra-demo-diagnosis-v1",

        promptVersion:
          "v1",

        input: {
          paymentId:
            degradedPayment.razorpayPaymentId,

          amount:
            degradedPayment.amount.toString(),

          gatewaySignal:
            "gateway_latency",

          failureRate: 0.31,

          latencyMs: 4200,
        },

        analysis: {
          diagnosis:
            "Payment degradation detected at the gateway level.",

          rootCause:
            "Elevated UPI gateway latency and failure rate",

          affectedMethod: "UPI",

          recoveryLikelihood: 0.67,

          recommendedStrategy:
            "SEND_PAYMENT_LINK",

          recommendedChannel:
            "PAYMENT_API",

          reasoning:
            "Repeated UPI degradation suggests avoiding immediate repeated attempts through the same failing path.",
        },

        confidence: "0.86",
      },
    });

  console.log(
    `✅ AI analyses created: ${failedAnalysis.id}, ${degradationAnalysis.id}`,
  );

  const failedDecision =
    await prisma.recoveryDecision.create({
      data: {
        revenueRiskId:
          failedPaymentRisk.id,

        strategy:
          "RETRY_PAYMENT",

        reason:
          "Customer has previous successful payments and the failure appears recoverable.",

        priority: 10,

        status: "APPROVED",

        expiresAt: new Date(
          now.getTime() +
            72 * 60 * 60 * 1000,
        ),
      },
    });

  const degradationDecision =
    await prisma.recoveryDecision.create({
      data: {
        revenueRiskId:
          degradationRisk.id,

        strategy:
          "SEND_PAYMENT_LINK",

        reason:
          "Gateway degradation makes immediate retry less reliable.",

        priority: 8,

        status: "PENDING",

        expiresAt: new Date(
          now.getTime() +
            72 * 60 * 60 * 1000,
        ),
      },
    });

  console.log(
    "✅ Recovery decisions created",
  );

  await prisma.policyEvaluation.createMany({
    data: [
      {
        recoveryDecisionId:
          failedDecision.id,

        result: "ALLOWED",

        reason:
          "Automatic retry is enabled and retry count is within policy limits.",
      },

      {
        recoveryDecisionId:
          degradationDecision.id,

        result: "ALLOWED",

        reason:
          "Payment-link recovery is within communication and retry limits.",
      },
    ],
  });

  console.log(
    "✅ Policy evaluations created",
  );

  const failedCase =
    await prisma.recoveryCase.create({
      data: {
        merchantId: merchant.id,

        revenueRiskId:
          failedPaymentRisk.id,

        decisionId:
          failedDecision.id,

        status: "ACTIVE",

        strategy:
          "RETRY_PAYMENT",

        startedAt: now,
      },
    });

  const degradationCase =
    await prisma.recoveryCase.create({
      data: {
        merchantId: merchant.id,

        revenueRiskId:
          degradationRisk.id,

        decisionId:
          degradationDecision.id,

        status: "PENDING",

        strategy:
          "SEND_PAYMENT_LINK",
      },
    });

  console.log(
    "✅ Recovery cases created",
  );

  const retryAction =
    await prisma.recoveryAction.create({
      data: {
        recoveryCaseId:
          failedCase.id,

        actionType:
          "RETRY_PAYMENT",

        channel:
          "PAYMENT_API",

        status:
          "SCHEDULED",

        scheduledAt:
          new Date(
            now.getTime() +
              5 * 60 * 1000,
          ),
      },
    });

  const paymentLinkAction =
    await prisma.recoveryAction.create({
      data: {
        recoveryCaseId:
          degradationCase.id,

        actionType:
          "SEND_PAYMENT_LINK",

        channel:
          "EMAIL",

        status:
          "SCHEDULED",

        scheduledAt:
          new Date(
            now.getTime() +
              10 * 60 * 1000,
          ),
      },
    });

  console.log(
    "✅ Recovery actions created",
  );

  await prisma.recoveryAttempt.create({
    data: {
      recoveryActionId:
        retryAction.id,

      attemptNumber: 1,

      status: "FAILED",

      externalReference:
        failedPayment.razorpayPaymentId,

      errorCode:
        failedPayment.failureCode,

      errorMessage:
        failedPayment.failureReason,
    },
  });

  await prisma.auditLog.createMany({
    data: [
      {
        merchantId: merchant.id,

        entityType:
          "RevenueRisk",

        entityId:
          failedPaymentRisk.id,

        action:
          "RISK_DETECTED",

        actorType:
          "SYSTEM",

        reason:
          "Failed Razorpay payment detected.",
      },

      {
        merchantId: merchant.id,

        entityType:
          "AIAnalysis",

        entityId:
          failedAnalysis.id,

        action:
          "AI_ANALYSIS_CREATED",

        actorType:
          "AI_AGENT",

        reason:
          "Demo AI diagnosis generated.",
      },

      {
        merchantId: merchant.id,

        entityType:
          "RecoveryDecision",

        entityId:
          failedDecision.id,

        action:
          "RECOVERY_DECISION_CREATED",

        actorType:
          "AI_AGENT",

        reason:
          "Retry payment recommended.",
      },

      {
        merchantId: merchant.id,

        entityType:
          "RecoveryAction",

        entityId:
          retryAction.id,

        action:
          "ACTION_SCHEDULED",

        actorType:
          "POLICY_ENGINE",

        reason:
          "Retry is within configured recovery policy.",
      },
    ],
  });

  console.log(
    "✅ Audit trail created",
  );

  console.log("\n========================================");
  console.log("        FAARRA DEMO DATA READY");
  console.log("========================================\n");

  console.log(
    `Merchant:       ${merchant.id}`,
  );

  console.log(
    `Customers:      3`,
  );

  console.log(
    `Payments:       ${createdPayments.length}`,
  );

  console.log(
    `Revenue Events: 2`,
  );

  console.log(
    `Revenue Risks:  2`,
  );

  console.log(
    `Risk Signals:   6`,
  );

  console.log(
    `AI Analyses:    2`,
  );

  console.log(
    `Decisions:      2`,
  );

  console.log(
    `Recovery Cases: 2`,
  );

  console.log(
    `Actions:        2`,
  );

  console.log(
    `Policy:         1`,
  );

  console.log(
    `\nRisk #1: FAILED_PAYMENT → RETRY_PAYMENT`,
  );

  console.log(
    `Risk #2: PAYMENT_DEGRADATION → SEND_PAYMENT_LINK`,
  );

  console.log(
    "\n🚀 FAARRA demo pipeline is ready for the AI engine.\n",
  );
}

main()
  .catch((error) => {
    console.error(
      "\n❌ FAARRA demo seed failed:\n",
      error,
    );

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });