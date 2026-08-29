import { PrismaClient } from "@prisma/client";

type RevenueEvent = {
  id: string;
  merchantId: string;
  eventType:
    | "PAYMENT_CREATED"
    | "PAYMENT_FAILED"
    | "PAYMENT_CAPTURED"
    | "SUBSCRIPTION_FAILED"
    | "SUBSCRIPTION_CHARGE_FAILED"
    | "INVOICE_OVERDUE"
    | "CHECKOUT_ABANDONED"
    | "PAYMENT_DEGRADED"
    | "MANDATE_FAILED"
    | "PAYMENT_LINK_EXPIRED";
  sourceType: string;
  sourceId: string | null;
  payload: unknown;
  status: "PENDING" | "PROCESSED" | "FAILED";
  occurredAt: Date;
  createdAt: Date;
};

type Customer = {
  id: string;
  merchantId: string;
  razorpayCustomerId: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  preferredLanguage: "ENGLISH" | "HINDI" | "HINGLISH";
  createdAt: Date;
  updatedAt: Date;
};

type Payment = {
  id: string;
  merchantId: string;
  customerId: string | null;
  razorpayPaymentId: string;
  amount: string;
  currency: string;
  status:
    | "CREATED"
    | "AUTHORIZED"
    | "CAPTURED"
    | "FAILED"
    | "REFUNDED"
    | "PARTIALLY_REFUNDED"
    | "CANCELLED";
  method: string | null;
  failureCode: string | null;
  failureReason: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type PaymentWithCustomer = Payment & {
  customer: Customer | null;
};

type Subscription = {
  id: string;
  merchantId: string;
  customerId: string | null;
  razorpaySubscriptionId: string;
  amount: string;
  currency: string;
  status:
    | "CREATED"
    | "ACTIVE"
    | "PENDING"
    | "HALTED"
    | "CANCELLED"
    | "COMPLETED"
    | "EXPIRED";
  nextChargeAt: Date | null;
  failedAttempts: number;
  createdAt: Date;
  updatedAt: Date;
};

type SubscriptionWithCustomer = Subscription & {
  customer: Customer | null;
};

type Invoice = {
  id: string;
  merchantId: string;
  customerId: string | null;
  razorpayInvoiceId: string;
  amount: string;
  dueAmount: string;
  currency: string;
  status:
    | "DRAFT"
    | "ISSUED"
    | "PARTIALLY_PAID"
    | "PAID"
    | "OVERDUE"
    | "CANCELLED";
  dueAt: Date | null;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type InvoiceWithCustomer = Invoice & {
  customer: Customer | null;
};

type RevenueRisk = {
  id: string;
  merchantId: string;
  customerId: string | null;
  revenueEventId: string | null;
  sourceType: string;
  sourceId: string | null;
  riskType:
    | "FAILED_PAYMENT"
    | "FAILED_SUBSCRIPTION"
    | "CHECKOUT_ABANDONMENT"
    | "OVERDUE_INVOICE"
    | "PAYMENT_DEGRADATION"
    | "MANDATE_FAILURE"
    | "PAYMENT_LINK_EXPIRY";
  status:
    | "OPEN"
    | "IN_RECOVERY"
    | "RECOVERED"
    | "PARTIALLY_RECOVERED"
    | "EXPIRED"
    | "CLOSED";
  riskScore: string;
  probability: string;
  amountAtRisk: string;
  expectedLoss: string;
  currency: string;
  detectedAt: Date;
  expiresAt: Date | null;
  resolvedAt: Date | null;
};

export class DetectionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findPendingRevenueEvents(
    merchantId: string,
  ): Promise<RevenueEvent[]> {
    const events = await this.prisma.revenueEvent.findMany({
      where: {
        merchantId,
        status: "PENDING",
      },
      orderBy: {
        occurredAt: "asc",
      },
    });

    return events.map((event) => ({
      id: event.id,
      merchantId: event.merchantId,
      eventType: event.eventType,
      sourceType: event.sourceType,
      sourceId: event.sourceId,
      payload: event.payload,
      status: event.status,
      occurredAt: event.occurredAt,
      createdAt: event.createdAt,
    }));
  }

  async findRevenueEventById(
    merchantId: string,
    revenueEventId: string,
  ): Promise<RevenueEvent | null> {
    const event = await this.prisma.revenueEvent.findFirst({
      where: {
        id: revenueEventId,
        merchantId,
      },
    });

    if (!event) {
      return null;
    }

    return {
      id: event.id,
      merchantId: event.merchantId,
      eventType: event.eventType,
      sourceType: event.sourceType,
      sourceId: event.sourceId,
      payload: event.payload,
      status: event.status,
      occurredAt: event.occurredAt,
      createdAt: event.createdAt,
    };
  }

  async findExistingRiskForEvent(
    merchantId: string,
    revenueEventId: string,
  ): Promise<RevenueRisk | null> {
    const risk = await this.prisma.revenueRisk.findFirst({
      where: {
        merchantId,
        revenueEventId,
        status: {
          in: ["OPEN", "IN_RECOVERY"],
        },
      },
    });

    if (!risk) {
      return null;
    }

    return {
      id: risk.id,
      merchantId: risk.merchantId,
      customerId: risk.customerId,
      revenueEventId: risk.revenueEventId,
      sourceType: risk.sourceType,
      sourceId: risk.sourceId,
      riskType: risk.riskType,
      status: risk.status,
      riskScore: risk.riskScore.toString(),
      probability: risk.probability.toString(),
      amountAtRisk: risk.amountAtRisk.toString(),
      expectedLoss: risk.expectedLoss.toString(),
      currency: risk.currency,
      detectedAt: risk.detectedAt,
      expiresAt: risk.expiresAt,
      resolvedAt: risk.resolvedAt,
    };
  }

  async findPayment(
    merchantId: string,
    paymentId: string,
  ): Promise<PaymentWithCustomer | null> {
    const payment = await this.prisma.payment.findFirst({
      where: {
        merchantId,
        id: paymentId,
      },
      include: {
        customer: true,
      },
    });

    if (!payment) {
      return null;
    }

    return this.mapPayment(payment);
  }

  async findPaymentByRazorpayId(
    merchantId: string,
    razorpayPaymentId: string,
  ): Promise<PaymentWithCustomer | null> {
    const payment = await this.prisma.payment.findFirst({
      where: {
        merchantId,
        razorpayPaymentId,
      },
      include: {
        customer: true,
      },
    });

    if (!payment) {
      return null;
    }

    return this.mapPayment(payment);
  }

  async findSubscription(
    merchantId: string,
    subscriptionId: string,
  ): Promise<SubscriptionWithCustomer | null> {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        merchantId,
        id: subscriptionId,
      },
      include: {
        customer: true,
      },
    });

    if (!subscription) {
      return null;
    }

    return this.mapSubscription(subscription);
  }

  async findSubscriptionByRazorpayId(
    merchantId: string,
    razorpaySubscriptionId: string,
  ): Promise<SubscriptionWithCustomer | null> {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        merchantId,
        razorpaySubscriptionId,
      },
      include: {
        customer: true,
      },
    });

    if (!subscription) {
      return null;
    }

    return this.mapSubscription(subscription);
  }

  async findInvoice(
    merchantId: string,
    invoiceId: string,
  ): Promise<InvoiceWithCustomer | null> {
    const invoice = await this.prisma.invoice.findFirst({
      where: {
        merchantId,
        id: invoiceId,
      },
      include: {
        customer: true,
      },
    });

    if (!invoice) {
      return null;
    }

    return this.mapInvoice(invoice);
  }

  async findInvoiceByRazorpayId(
    merchantId: string,
    razorpayInvoiceId: string,
  ): Promise<InvoiceWithCustomer | null> {
    const invoice = await this.prisma.invoice.findFirst({
      where: {
        merchantId,
        razorpayInvoiceId,
      },
      include: {
        customer: true,
      },
    });

    if (!invoice) {
      return null;
    }

    return this.mapInvoice(invoice);
  }

  async findCustomerPaymentHistory(
    merchantId: string,
    customerId: string,
  ): Promise<Payment[]> {
    const payments = await this.prisma.payment.findMany({
      where: {
        merchantId,
        customerId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return payments.map((payment) => this.mapPayment(payment).withoutCustomer);
  }

  async findCustomerSubscriptionHistory(
    merchantId: string,
    customerId: string,
  ): Promise<Subscription[]> {
    const subscriptions = await this.prisma.subscription.findMany({
      where: {
        merchantId,
        customerId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return subscriptions.map(
      (subscription) => this.mapSubscription(subscription).withoutCustomer,
    );
  }

  async findCustomerInvoiceHistory(
    merchantId: string,
    customerId: string,
  ): Promise<Invoice[]> {
    const invoices = await this.prisma.invoice.findMany({
      where: {
        merchantId,
        customerId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return invoices.map(
      (invoice) => this.mapInvoice(invoice).withoutCustomer,
    );
  }

  async findCustomerRisks(
    merchantId: string,
    customerId: string,
  ): Promise<RevenueRisk[]> {
    const risks = await this.prisma.revenueRisk.findMany({
      where: {
        merchantId,
        customerId,
      },
      orderBy: {
        detectedAt: "desc",
      },
    });

    return risks.map((risk) => ({
      id: risk.id,
      merchantId: risk.merchantId,
      customerId: risk.customerId,
      revenueEventId: risk.revenueEventId,
      sourceType: risk.sourceType,
      sourceId: risk.sourceId,
      riskType: risk.riskType,
      status: risk.status,
      riskScore: risk.riskScore.toString(),
      probability: risk.probability.toString(),
      amountAtRisk: risk.amountAtRisk.toString(),
      expectedLoss: risk.expectedLoss.toString(),
      currency: risk.currency,
      detectedAt: risk.detectedAt,
      expiresAt: risk.expiresAt,
      resolvedAt: risk.resolvedAt,
    }));
  }

async createRevenueRisk(data: {
  merchantId: string;
  customerId?: string;
  revenueEventId?: string;
  sourceType: string;
  sourceId?: string;
  riskType:
    | "FAILED_PAYMENT"
    | "FAILED_SUBSCRIPTION"
    | "CHECKOUT_ABANDONMENT"
    | "OVERDUE_INVOICE"
    | "PAYMENT_DEGRADATION"
    | "MANDATE_FAILURE"
    | "PAYMENT_LINK_EXPIRY";
  riskScore: string;
  probability: string;
  amountAtRisk: string;
  expectedLoss: string;
  currency: string;
  detectedAt?: Date;
  expiresAt?: Date;
}): Promise<RevenueRisk> {
  const risk = await this.prisma.revenueRisk.create({
    data: {
      merchantId: data.merchantId,

      ...(data.customerId !== undefined && {
        customerId: data.customerId,
      }),

      ...(data.revenueEventId !== undefined && {
        revenueEventId: data.revenueEventId,
      }),

      sourceType: data.sourceType,

      ...(data.sourceId !== undefined && {
        sourceId: data.sourceId,
      }),

      riskType: data.riskType,
      riskScore: data.riskScore,
      probability: data.probability,
      amountAtRisk: data.amountAtRisk,
      expectedLoss: data.expectedLoss,
      currency: data.currency,

      ...(data.detectedAt !== undefined && {
        detectedAt: data.detectedAt,
      }),

      ...(data.expiresAt !== undefined && {
        expiresAt: data.expiresAt,
      }),
    },
  });

  return {
    id: risk.id,
    merchantId: risk.merchantId,
    customerId: risk.customerId,
    revenueEventId: risk.revenueEventId,
    sourceType: risk.sourceType,
    sourceId: risk.sourceId,
    riskType: risk.riskType,
    status: risk.status,
    riskScore: risk.riskScore.toString(),
    probability: risk.probability.toString(),
    amountAtRisk: risk.amountAtRisk.toString(),
    expectedLoss: risk.expectedLoss.toString(),
    currency: risk.currency,
    detectedAt: risk.detectedAt,
    expiresAt: risk.expiresAt,
    resolvedAt: risk.resolvedAt,
  };
}

  async markRevenueEventProcessed(
    merchantId: string,
    revenueEventId: string,
  ): Promise<{ count: number }> {
    return this.prisma.revenueEvent.updateMany({
      where: {
        id: revenueEventId,
        merchantId,
        status: "PENDING",
      },
      data: {
        status: "PROCESSED",
      },
    });
  }

  async markRevenueEventFailed(
    merchantId: string,
    revenueEventId: string,
  ): Promise<{ count: number }> {
    return this.prisma.revenueEvent.updateMany({
      where: {
        id: revenueEventId,
        merchantId,
        status: "PENDING",
      },
      data: {
        status: "FAILED",
      },
    });
  }

  private mapCustomer(customer: Customer | null): Customer | null {
    if (!customer) {
      return null;
    }

    return {
      id: customer.id,
      merchantId: customer.merchantId,
      razorpayCustomerId: customer.razorpayCustomerId,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      preferredLanguage: customer.preferredLanguage,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  }

  private mapPayment(
    payment: any,
  ): PaymentWithCustomer & {
    withoutCustomer: Payment;
  } {
    const mappedPayment: Payment = {
      id: payment.id,
      merchantId: payment.merchantId,
      customerId: payment.customerId,
      razorpayPaymentId: payment.razorpayPaymentId,
      amount: payment.amount.toString(),
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      failureCode: payment.failureCode,
      failureReason: payment.failureReason,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };

    return {
      ...mappedPayment,
      customer: this.mapCustomer(payment.customer),
      withoutCustomer: mappedPayment,
    };
  }

  private mapSubscription(
    subscription: any,
  ): SubscriptionWithCustomer & {
    withoutCustomer: Subscription;
  } {
    const mappedSubscription: Subscription = {
      id: subscription.id,
      merchantId: subscription.merchantId,
      customerId: subscription.customerId,
      razorpaySubscriptionId: subscription.razorpaySubscriptionId,
      amount: subscription.amount.toString(),
      currency: subscription.currency,
      status: subscription.status,
      nextChargeAt: subscription.nextChargeAt,
      failedAttempts: subscription.failedAttempts,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
    };

    return {
      ...mappedSubscription,
      customer: this.mapCustomer(subscription.customer),
      withoutCustomer: mappedSubscription,
    };
  }

  private mapInvoice(
    invoice: any,
  ): InvoiceWithCustomer & {
    withoutCustomer: Invoice;
  } {
    const mappedInvoice: Invoice = {
      id: invoice.id,
      merchantId: invoice.merchantId,
      customerId: invoice.customerId,
      razorpayInvoiceId: invoice.razorpayInvoiceId,
      amount: invoice.amount.toString(),
      dueAmount: invoice.dueAmount.toString(),
      currency: invoice.currency,
      status: invoice.status,
      dueAt: invoice.dueAt,
      paidAt: invoice.paidAt,
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    };

    return {
      ...mappedInvoice,
      customer: this.mapCustomer(invoice.customer),
      withoutCustomer: mappedInvoice,
    };
  }
}