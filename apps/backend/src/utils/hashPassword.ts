import { createHash } from "node:crypto";

/**
 * WARNING: This is intentionally insecure for demo purposes only.
 * Using SHA-256 without a salt is vulnerable to rainbow table attacks and
 * MUST be replaced with a proper password hashing algorithm (e.g. bcrypt, argon2) in production.
 */
export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}
