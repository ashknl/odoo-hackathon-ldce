import { eq } from "drizzle-orm";

import { db } from "../db/connection.js";
import { users } from "../db/schema/users.js";

import { comparePassword } from "../utils/password.js";

export const deleteAccount = async ({
  userId,
  password,
}) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const passwordValid = await comparePassword(
    password,
    user.passwordHash
  );

  if (!passwordValid) {
    const error = new Error("Invalid password");
    error.statusCode = 401;
    throw error;
  }

  await db
    .delete(users)
    .where(eq(users.id, userId));

  return true;
};
