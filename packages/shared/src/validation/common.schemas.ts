import { z } from "zod";

export const idSchema = z.string().min(1);

export const uuidSchema = z.uuid();

export const currencySchema = z
  .string()
  .length(3)
  .transform((value) => value.toUpperCase());

export const amountSchema = z
  .number()
  .finite()
  .nonnegative();

export const percentageSchema = z
  .number()
  .min(0)
  .max(100);

export const probabilitySchema = z
  .number()
  .min(0)
  .max(1);

export const timestampSchema = z.coerce.date();

export const positiveIntegerSchema = z
  .number()
  .int()
  .positive();