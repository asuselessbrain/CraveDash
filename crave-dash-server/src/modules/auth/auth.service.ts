import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";
import AppError from "../../errors/appError";
import jwt from "jsonwebtoken";
import { config } from "../../config";
import { StringValue } from "ms";

const loginUser = async (payload: { email: string; password: string }) => {
  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });

  const isPasswordMatch = await bcrypt.compare(
    payload.password,
    isUserExist.password,
  );

  if (!isPasswordMatch) {
    throw new AppError(401, "Invalid credentials");
  }

  const token = jwt.sign(
    { email: isUserExist.email, role: isUserExist.role },
    String(config.jwt.secret),
    { expiresIn: config.jwt.expiresIn as StringValue },
  );

  return {
    token,
    user: isUserExist,
  };
};

export const AuthService = {
  loginUser,
};
