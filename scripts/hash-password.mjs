// Usage: node scripts/hash-password.mjs "your-password"
// Prints a bcrypt hash to put in ADMIN_PASSWORD_HASH in .env.local.
// IMPORTANT: escape every "$" in the printed hash as "\$" when pasting it
// into .env.local — Next.js expands $VAR references in env files, which
// silently corrupts an unescaped bcrypt hash.
import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error("Usage: node scripts/hash-password.mjs <password>");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
console.log(hash);
