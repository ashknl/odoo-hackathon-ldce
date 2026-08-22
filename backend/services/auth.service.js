import { eq } from "drizzle-orm";

import { db } from "../db/connection.js";
import { users } from "../db/schema/users.js";

import {
  hashPassword,
  comparePassword,
} from "../utils/password.js";

import { generateToken } from "../utils/jwt.js";

export const signup = async ({
  name,
  email,
  password,
}) => {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await db
    .select({
      id: users.id,
    })
    .from(users)
    .where(eq(users.email, normalizedEmail));

  if (existingUser.length > 0) {
    const error = new Error(
      "An account with this email already exists"
    );

    error.statusCode = 409;

    throw error;
  }

  const passwordHash = await hashPassword(password);

  const [user] = await db
    .insert(users)
    .values({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
    });

  const token = generateToken(user.id);

  return {
    user,
    token,
  };
};

export const login = async ({
  email,
  password,
}) => {
  const normalizedEmail = email.trim().toLowerCase();

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, normalizedEmail));

  if (!user) {
    const error = new Error(
      "Invalid email or password"
    );

    error.statusCode = 401;

    throw error;
  }

  const passwordValid = await comparePassword(
    password,
    user.passwordHash
  );

  if (!passwordValid) {
    const error = new Error(
      "Invalid email or password"
    );

    error.statusCode = 401;

    throw error;
  }

  const token = generateToken(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.profileImage,
      createdAt: user.createdAt,
    },
    token,
  };
};

export const getCurrentUser = async (userId) => {
  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      avatarUrl: users.profileImage,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, userId));

  if (!user) {
    const error = new Error("User not found");

    error.statusCode = 404;

    throw error;
  }

  return user;
};


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

