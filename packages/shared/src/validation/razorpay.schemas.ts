import { z } from "zod";

export const razorpayWebhookSchema = z.object({
  entity: z.string(),

  account_id: z.string().optional(),

  event: z.string(),

  contains: z.array(z.string()).optional(),

  payload: z.record(
    z.string(),
    z.unknown(),
  ),

  created_at: z.number().int().optional(),
});

export type RazorpayWebhook =
  z.infer<typeof razorpayWebhookSchema>;