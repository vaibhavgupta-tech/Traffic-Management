import crypto from "node:crypto";

export function makeId(prefix: string) {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
}
