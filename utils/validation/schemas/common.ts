import { z } from "zod";

export const FileType = typeof File !== "undefined" ? File : Object;

export const priceSchema = z
  .string()
  .trim()
  .regex(/^\d+(\.\d{1,2})?$/, "Invalid price")
  .transform((val) => Number(val));

export const uuidSchema = z.uuid("Invalid UUID format");

export const collectionNameSchema = z
  .string()
  .min(1, "Collection name must be at least 1 character")
  .max(30, "Collection name must be no more than 30 characters")
  .regex(/^[a-zA-Z0-9\s\-_]+$/, "Collection name contains invalid characters");

export const orderStatusSchema = z
  .string()
  .min(1, "Collection name must be at least 1 character")
  .max(10, "Collection name must be no more than 30 characters")
  .regex(/^[a-zA-Z]+$/, "status contains invalid characters");
