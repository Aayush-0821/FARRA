export interface RazorpayCustomer {
  id: string;
  name: string;
  email?: string;
  contact?: string;
  gstin?: string;
  notes?: Record<string, string>;
  createdAt?: number;
}

export interface CreateRazorpayCustomerInput {
  name: string;
  email?: string;
  contact?: string;
  gstin?: string;
  notes?: Record<string, string>;
}

export interface UpdateRazorpayCustomerInput {
  name?: string;
  email?: string;
  contact?: string;
  gstin?: string;
  notes?: Record<string, string>;
}