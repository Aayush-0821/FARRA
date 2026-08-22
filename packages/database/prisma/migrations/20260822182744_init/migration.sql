-- CreateEnum
CREATE TYPE "MerchantStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DISCONNECTED');

-- CreateEnum
CREATE TYPE "ConnectionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'REVOKED', 'DISCONNECTED');

-- CreateEnum
CREATE TYPE "CustomerLanguage" AS ENUM ('ENGLISH', 'HINDI', 'HINGLISH');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('CREATED', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('CREATED', 'ACTIVE', 'PENDING', 'HALTED', 'CANCELLED', 'COMPLETED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'ISSUED', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "WebhookStatus" AS ENUM ('RECEIVED', 'PROCESSING', 'PROCESSED', 'FAILED', 'IGNORED');

-- CreateEnum
CREATE TYPE "RevenueEventType" AS ENUM ('PAYMENT_CREATED', 'PAYMENT_FAILED', 'PAYMENT_CAPTURED', 'SUBSCRIPTION_FAILED', 'SUBSCRIPTION_CHARGE_FAILED', 'INVOICE_OVERDUE', 'CHECKOUT_ABANDONED', 'PAYMENT_DEGRADED', 'MANDATE_FAILED', 'PAYMENT_LINK_EXPIRED');

-- CreateEnum
CREATE TYPE "RevenueEventStatus" AS ENUM ('PENDING', 'PROCESSED', 'FAILED');

-- CreateEnum
CREATE TYPE "RevenueRiskType" AS ENUM ('FAILED_PAYMENT', 'FAILED_SUBSCRIPTION', 'CHECKOUT_ABANDONMENT', 'OVERDUE_INVOICE', 'PAYMENT_DEGRADATION', 'MANDATE_FAILURE', 'PAYMENT_LINK_EXPIRY');

-- CreateEnum
CREATE TYPE "RevenueRiskStatus" AS ENUM ('OPEN', 'IN_RECOVERY', 'RECOVERED', 'PARTIALLY_RECOVERED', 'EXPIRED', 'CLOSED');

-- CreateEnum
CREATE TYPE "RiskSignalType" AS ENUM ('PAYMENT_FAILURE', 'CUSTOMER_HISTORY', 'PAYMENT_METHOD', 'RETRY_HISTORY', 'SUBSCRIPTION_HISTORY', 'CHECKOUT_BEHAVIOR', 'INVOICE_AGE', 'CUSTOMER_VALUE', 'FAILURE_FREQUENCY', 'OTHER');

-- CreateEnum
CREATE TYPE "RecoveryStrategy" AS ENUM ('RETRY_PAYMENT', 'RETRY_MANDATE', 'SEND_PAYMENT_LINK', 'SEND_EMAIL', 'SEND_WHATSAPP', 'VOICE_RECOVERY', 'SUBSCRIPTION_RETRY', 'PAYMENT_REMINDER', 'B2B_CHASER', 'PROMISE_TO_PAY', 'ESCALATE', 'NO_ACTION');

-- CreateEnum
CREATE TYPE "DecisionStatus" AS ENUM ('PENDING', 'APPROVED', 'BLOCKED', 'EXECUTED', 'FAILED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PolicyResult" AS ENUM ('ALLOWED', 'BLOCKED', 'ESCALATED');

-- CreateEnum
CREATE TYPE "RecoveryCaseStatus" AS ENUM ('PENDING', 'ACTIVE', 'RECOVERED', 'PARTIALLY_RECOVERED', 'FAILED', 'STOPPED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "RecoveryActionType" AS ENUM ('RETRY_PAYMENT', 'RETRY_MANDATE', 'SEND_EMAIL', 'SEND_WHATSAPP', 'SEND_SMS', 'VOICE_CALL', 'SEND_PAYMENT_LINK', 'SUBSCRIPTION_RETRY', 'PAYMENT_REMINDER', 'ESCALATE');

-- CreateEnum
CREATE TYPE "RecoveryChannel" AS ENUM ('PAYMENT_API', 'EMAIL', 'WHATSAPP', 'SMS', 'VOICE', 'DASHBOARD');

-- CreateEnum
CREATE TYPE "ActionStatus" AS ENUM ('SCHEDULED', 'EXECUTING', 'SUCCESS', 'FAILED', 'SKIPPED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AttemptStatus" AS ENUM ('STARTED', 'SUCCESS', 'FAILED', 'TIMEOUT', 'CANCELLED');

-- CreateEnum
CREATE TYPE "VerificationType" AS ENUM ('PAYMENT_STATUS', 'RAZORPAY_WEBHOOK', 'TRANSACTION_LOOKUP', 'MANUAL');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'FAILED');

-- CreateEnum
CREATE TYPE "VoiceRecoveryStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'NO_ANSWER', 'DECLINED');

-- CreateEnum
CREATE TYPE "PromiseStatus" AS ENUM ('PENDING', 'FULFILLED', 'BROKEN', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AttributionType" AS ENUM ('DIRECT', 'ASSISTED', 'PROBABILISTIC');

-- CreateEnum
CREATE TYPE "AuditActorType" AS ENUM ('AI_AGENT', 'POLICY_ENGINE', 'SYSTEM', 'WORKER', 'MERCHANT', 'RAZORPAY');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('RISK_DETECTED', 'AI_ANALYSIS_CREATED', 'RECOVERY_DECISION_CREATED', 'POLICY_EVALUATED', 'ACTION_SCHEDULED', 'ACTION_EXECUTED', 'ACTION_FAILED', 'RECOVERY_VERIFIED', 'REVENUE_ATTRIBUTED', 'CASE_STOPPED', 'ESCALATION_CREATED', 'VOICE_CALL_STARTED', 'VOICE_CALL_COMPLETED');

-- CreateTable
CREATE TABLE "Merchant" (
    "id" TEXT NOT NULL,
    "razorpayAccountId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "MerchantStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Merchant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RazorpayConnection" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'razorpay',
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "status" "ConnectionStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RazorpayConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "razorpayCustomerId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "preferredLanguage" "CustomerLanguage" NOT NULL DEFAULT 'ENGLISH',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "customerId" TEXT,
    "razorpayPaymentId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "PaymentStatus" NOT NULL,
    "method" TEXT,
    "failureCode" TEXT,
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "customerId" TEXT,
    "razorpaySubscriptionId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "SubscriptionStatus" NOT NULL,
    "nextChargeAt" TIMESTAMP(3),
    "failedAttempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "customerId" TEXT,
    "razorpayInvoiceId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "dueAmount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "InvoiceStatus" NOT NULL,
    "dueAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookEvent" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "status" "WebhookStatus" NOT NULL DEFAULT 'RECEIVED',
    "error" TEXT,

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RevenueEvent" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "eventType" "RevenueEventType" NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT,
    "payload" JSONB NOT NULL,
    "status" "RevenueEventStatus" NOT NULL DEFAULT 'PENDING',
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RevenueEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RevenueRisk" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "customerId" TEXT,
    "revenueEventId" TEXT,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT,
    "riskType" "RevenueRiskType" NOT NULL,
    "status" "RevenueRiskStatus" NOT NULL DEFAULT 'OPEN',
    "riskScore" DECIMAL(65,30) NOT NULL,
    "probability" DECIMAL(65,30) NOT NULL,
    "amountAtRisk" DECIMAL(65,30) NOT NULL,
    "expectedLoss" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "RevenueRisk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskSignal" (
    "id" TEXT NOT NULL,
    "revenueRiskId" TEXT NOT NULL,
    "signalType" "RiskSignalType" NOT NULL,
    "value" TEXT,
    "weight" DECIMAL(65,30),
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiskSignal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIAnalysis" (
    "id" TEXT NOT NULL,
    "revenueRiskId" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "promptVersion" TEXT,
    "input" JSONB,
    "analysis" JSONB NOT NULL,
    "confidence" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecoveryDecision" (
    "id" TEXT NOT NULL,
    "revenueRiskId" TEXT NOT NULL,
    "strategy" "RecoveryStrategy" NOT NULL,
    "reason" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "status" "DecisionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "RecoveryDecision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecoveryPolicy" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "maxRetries" INTEGER NOT NULL DEFAULT 3,
    "retryWindowHours" INTEGER NOT NULL DEFAULT 72,
    "maxCommunicationAttempts" INTEGER NOT NULL DEFAULT 3,
    "allowAutoRetry" BOOLEAN NOT NULL DEFAULT false,
    "allowVoiceRecovery" BOOLEAN NOT NULL DEFAULT false,
    "escalationThreshold" INTEGER NOT NULL DEFAULT 3,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecoveryPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PolicyEvaluation" (
    "id" TEXT NOT NULL,
    "recoveryDecisionId" TEXT NOT NULL,
    "result" "PolicyResult" NOT NULL,
    "reason" TEXT,
    "evaluatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PolicyEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecoveryCase" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "revenueRiskId" TEXT NOT NULL,
    "decisionId" TEXT,
    "status" "RecoveryCaseStatus" NOT NULL DEFAULT 'PENDING',
    "strategy" "RecoveryStrategy" NOT NULL,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "stoppedAt" TIMESTAMP(3),
    "stopReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecoveryCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecoveryAction" (
    "id" TEXT NOT NULL,
    "recoveryCaseId" TEXT NOT NULL,
    "actionType" "RecoveryActionType" NOT NULL,
    "channel" "RecoveryChannel" NOT NULL,
    "status" "ActionStatus" NOT NULL DEFAULT 'SCHEDULED',
    "scheduledAt" TIMESTAMP(3),
    "executedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecoveryAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecoveryAttempt" (
    "id" TEXT NOT NULL,
    "recoveryActionId" TEXT NOT NULL,
    "attemptNumber" INTEGER NOT NULL,
    "status" "AttemptStatus" NOT NULL,
    "externalReference" TEXT,
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "executedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecoveryAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecoveryVerification" (
    "id" TEXT NOT NULL,
    "recoveryCaseId" TEXT NOT NULL,
    "paymentId" TEXT,
    "verificationType" "VerificationType" NOT NULL,
    "referenceId" TEXT,
    "verifiedAmount" DECIMAL(65,30),
    "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "RecoveryVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoiceRecovery" (
    "id" TEXT NOT NULL,
    "recoveryCaseId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "status" "VoiceRecoveryStatus" NOT NULL DEFAULT 'SCHEDULED',
    "transcript" TEXT,
    "outcome" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "VoiceRecovery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromiseToPay" (
    "id" TEXT NOT NULL,
    "voiceRecoveryId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "promisedAt" TIMESTAMP(3) NOT NULL,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "status" "PromiseStatus" NOT NULL DEFAULT 'PENDING',
    "fulfilledAt" TIMESTAMP(3),

    CONSTRAINT "PromiseToPay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RevenueAttribution" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "recoveryCaseId" TEXT NOT NULL,
    "paymentId" TEXT,
    "amountAtRisk" DECIMAL(65,30) NOT NULL,
    "amountRecovered" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "attributionType" "AttributionType" NOT NULL,
    "confidence" DECIMAL(65,30),
    "recoveredAt" TIMESTAMP(3),

    CONSTRAINT "RevenueAttribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "actorType" "AuditActorType" NOT NULL,
    "actorId" TEXT,
    "before" JSONB,
    "after" JSONB,
    "reason" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_razorpayAccountId_key" ON "Merchant"("razorpayAccountId");

-- CreateIndex
CREATE INDEX "Merchant_status_idx" ON "Merchant"("status");

-- CreateIndex
CREATE INDEX "Merchant_createdAt_idx" ON "Merchant"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "RazorpayConnection_merchantId_key" ON "RazorpayConnection"("merchantId");

-- CreateIndex
CREATE INDEX "Customer_merchantId_idx" ON "Customer"("merchantId");

-- CreateIndex
CREATE INDEX "Customer_email_idx" ON "Customer"("email");

-- CreateIndex
CREATE INDEX "Customer_phone_idx" ON "Customer"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_merchantId_razorpayCustomerId_key" ON "Customer"("merchantId", "razorpayCustomerId");

-- CreateIndex
CREATE INDEX "Payment_merchantId_status_idx" ON "Payment"("merchantId", "status");

-- CreateIndex
CREATE INDEX "Payment_customerId_idx" ON "Payment"("customerId");

-- CreateIndex
CREATE INDEX "Payment_createdAt_idx" ON "Payment"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_merchantId_razorpayPaymentId_key" ON "Payment"("merchantId", "razorpayPaymentId");

-- CreateIndex
CREATE INDEX "Subscription_merchantId_status_idx" ON "Subscription"("merchantId", "status");

-- CreateIndex
CREATE INDEX "Subscription_nextChargeAt_idx" ON "Subscription"("nextChargeAt");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_merchantId_razorpaySubscriptionId_key" ON "Subscription"("merchantId", "razorpaySubscriptionId");

-- CreateIndex
CREATE INDEX "Invoice_merchantId_status_idx" ON "Invoice"("merchantId", "status");

-- CreateIndex
CREATE INDEX "Invoice_dueAt_idx" ON "Invoice"("dueAt");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_merchantId_razorpayInvoiceId_key" ON "Invoice"("merchantId", "razorpayInvoiceId");

-- CreateIndex
CREATE INDEX "WebhookEvent_merchantId_status_idx" ON "WebhookEvent"("merchantId", "status");

-- CreateIndex
CREATE INDEX "WebhookEvent_eventType_idx" ON "WebhookEvent"("eventType");

-- CreateIndex
CREATE INDEX "WebhookEvent_receivedAt_idx" ON "WebhookEvent"("receivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "WebhookEvent_merchantId_eventId_key" ON "WebhookEvent"("merchantId", "eventId");

-- CreateIndex
CREATE INDEX "RevenueEvent_merchantId_eventType_idx" ON "RevenueEvent"("merchantId", "eventType");

-- CreateIndex
CREATE INDEX "RevenueEvent_merchantId_occurredAt_idx" ON "RevenueEvent"("merchantId", "occurredAt");

-- CreateIndex
CREATE INDEX "RevenueRisk_merchantId_status_idx" ON "RevenueRisk"("merchantId", "status");

-- CreateIndex
CREATE INDEX "RevenueRisk_merchantId_riskType_idx" ON "RevenueRisk"("merchantId", "riskType");

-- CreateIndex
CREATE INDEX "RevenueRisk_customerId_idx" ON "RevenueRisk"("customerId");

-- CreateIndex
CREATE INDEX "RevenueRisk_detectedAt_idx" ON "RevenueRisk"("detectedAt");

-- CreateIndex
CREATE INDEX "RiskSignal_revenueRiskId_idx" ON "RiskSignal"("revenueRiskId");

-- CreateIndex
CREATE INDEX "RiskSignal_signalType_idx" ON "RiskSignal"("signalType");

-- CreateIndex
CREATE INDEX "AIAnalysis_revenueRiskId_idx" ON "AIAnalysis"("revenueRiskId");

-- CreateIndex
CREATE INDEX "AIAnalysis_createdAt_idx" ON "AIAnalysis"("createdAt");

-- CreateIndex
CREATE INDEX "RecoveryDecision_revenueRiskId_idx" ON "RecoveryDecision"("revenueRiskId");

-- CreateIndex
CREATE INDEX "RecoveryDecision_status_idx" ON "RecoveryDecision"("status");

-- CreateIndex
CREATE INDEX "RecoveryPolicy_merchantId_active_idx" ON "RecoveryPolicy"("merchantId", "active");

-- CreateIndex
CREATE INDEX "PolicyEvaluation_recoveryDecisionId_idx" ON "PolicyEvaluation"("recoveryDecisionId");

-- CreateIndex
CREATE INDEX "PolicyEvaluation_result_idx" ON "PolicyEvaluation"("result");

-- CreateIndex
CREATE INDEX "RecoveryCase_merchantId_status_idx" ON "RecoveryCase"("merchantId", "status");

-- CreateIndex
CREATE INDEX "RecoveryCase_revenueRiskId_idx" ON "RecoveryCase"("revenueRiskId");

-- CreateIndex
CREATE INDEX "RecoveryCase_createdAt_idx" ON "RecoveryCase"("createdAt");

-- CreateIndex
CREATE INDEX "RecoveryAction_recoveryCaseId_status_idx" ON "RecoveryAction"("recoveryCaseId", "status");

-- CreateIndex
CREATE INDEX "RecoveryAction_scheduledAt_idx" ON "RecoveryAction"("scheduledAt");

-- CreateIndex
CREATE INDEX "RecoveryAttempt_status_idx" ON "RecoveryAttempt"("status");

-- CreateIndex
CREATE UNIQUE INDEX "RecoveryAttempt_recoveryActionId_attemptNumber_key" ON "RecoveryAttempt"("recoveryActionId", "attemptNumber");

-- CreateIndex
CREATE INDEX "RecoveryVerification_recoveryCaseId_idx" ON "RecoveryVerification"("recoveryCaseId");

-- CreateIndex
CREATE INDEX "RecoveryVerification_paymentId_idx" ON "RecoveryVerification"("paymentId");

-- CreateIndex
CREATE INDEX "RecoveryVerification_status_idx" ON "RecoveryVerification"("status");

-- CreateIndex
CREATE UNIQUE INDEX "VoiceRecovery_recoveryCaseId_key" ON "VoiceRecovery"("recoveryCaseId");

-- CreateIndex
CREATE INDEX "VoiceRecovery_customerId_idx" ON "VoiceRecovery"("customerId");

-- CreateIndex
CREATE INDEX "VoiceRecovery_status_idx" ON "VoiceRecovery"("status");

-- CreateIndex
CREATE UNIQUE INDEX "PromiseToPay_voiceRecoveryId_key" ON "PromiseToPay"("voiceRecoveryId");

-- CreateIndex
CREATE INDEX "PromiseToPay_customerId_status_idx" ON "PromiseToPay"("customerId", "status");

-- CreateIndex
CREATE INDEX "PromiseToPay_dueAt_idx" ON "PromiseToPay"("dueAt");

-- CreateIndex
CREATE UNIQUE INDEX "RevenueAttribution_recoveryCaseId_key" ON "RevenueAttribution"("recoveryCaseId");

-- CreateIndex
CREATE INDEX "RevenueAttribution_merchantId_recoveredAt_idx" ON "RevenueAttribution"("merchantId", "recoveredAt");

-- CreateIndex
CREATE INDEX "RevenueAttribution_merchantId_attributionType_idx" ON "RevenueAttribution"("merchantId", "attributionType");

-- CreateIndex
CREATE INDEX "AuditLog_merchantId_timestamp_idx" ON "AuditLog"("merchantId", "timestamp");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- AddForeignKey
ALTER TABLE "RazorpayConnection" ADD CONSTRAINT "RazorpayConnection_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebhookEvent" ADD CONSTRAINT "WebhookEvent_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenueEvent" ADD CONSTRAINT "RevenueEvent_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenueRisk" ADD CONSTRAINT "RevenueRisk_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenueRisk" ADD CONSTRAINT "RevenueRisk_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenueRisk" ADD CONSTRAINT "RevenueRisk_revenueEventId_fkey" FOREIGN KEY ("revenueEventId") REFERENCES "RevenueEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskSignal" ADD CONSTRAINT "RiskSignal_revenueRiskId_fkey" FOREIGN KEY ("revenueRiskId") REFERENCES "RevenueRisk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIAnalysis" ADD CONSTRAINT "AIAnalysis_revenueRiskId_fkey" FOREIGN KEY ("revenueRiskId") REFERENCES "RevenueRisk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecoveryDecision" ADD CONSTRAINT "RecoveryDecision_revenueRiskId_fkey" FOREIGN KEY ("revenueRiskId") REFERENCES "RevenueRisk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecoveryPolicy" ADD CONSTRAINT "RecoveryPolicy_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PolicyEvaluation" ADD CONSTRAINT "PolicyEvaluation_recoveryDecisionId_fkey" FOREIGN KEY ("recoveryDecisionId") REFERENCES "RecoveryDecision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecoveryCase" ADD CONSTRAINT "RecoveryCase_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecoveryCase" ADD CONSTRAINT "RecoveryCase_revenueRiskId_fkey" FOREIGN KEY ("revenueRiskId") REFERENCES "RevenueRisk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecoveryCase" ADD CONSTRAINT "RecoveryCase_decisionId_fkey" FOREIGN KEY ("decisionId") REFERENCES "RecoveryDecision"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecoveryAction" ADD CONSTRAINT "RecoveryAction_recoveryCaseId_fkey" FOREIGN KEY ("recoveryCaseId") REFERENCES "RecoveryCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecoveryAttempt" ADD CONSTRAINT "RecoveryAttempt_recoveryActionId_fkey" FOREIGN KEY ("recoveryActionId") REFERENCES "RecoveryAction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecoveryVerification" ADD CONSTRAINT "RecoveryVerification_recoveryCaseId_fkey" FOREIGN KEY ("recoveryCaseId") REFERENCES "RecoveryCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecoveryVerification" ADD CONSTRAINT "RecoveryVerification_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceRecovery" ADD CONSTRAINT "VoiceRecovery_recoveryCaseId_fkey" FOREIGN KEY ("recoveryCaseId") REFERENCES "RecoveryCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceRecovery" ADD CONSTRAINT "VoiceRecovery_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromiseToPay" ADD CONSTRAINT "PromiseToPay_voiceRecoveryId_fkey" FOREIGN KEY ("voiceRecoveryId") REFERENCES "VoiceRecovery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromiseToPay" ADD CONSTRAINT "PromiseToPay_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenueAttribution" ADD CONSTRAINT "RevenueAttribution_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenueAttribution" ADD CONSTRAINT "RevenueAttribution_recoveryCaseId_fkey" FOREIGN KEY ("recoveryCaseId") REFERENCES "RecoveryCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenueAttribution" ADD CONSTRAINT "RevenueAttribution_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
