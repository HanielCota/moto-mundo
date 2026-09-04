const PASSWORD_SALT = "moto-mundo-salt";

export async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(`${password}${PASSWORD_SALT}`);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyPassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  const computed = await hashPassword(password);
  return computed === passwordHash;
}
