import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";
import AppError from "../../errors/appError";
import jwt from "jsonwebtoken";
import { config } from "../../config";
import { StringValue } from "ms";
import { sendEmail } from "../../utils/emailSender";
import { resetPasswordHtml } from "../../utils/EmailTempletes/ForgetPassword";

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

const forgetPassword = async (payload: { email: string }) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!isUserExist) {
    throw new AppError(404, "User not found");
  }

  if (isUserExist.updatedAt.getTime() + 15 * 60 * 1000 > Date.now()) {
    throw new AppError(429, "Password reset already requested. Please try again later.");
  }

  const token = jwt.sign(
    { email: isUserExist.email, role: isUserExist.role },
    String(config.jwt.secret),
    { expiresIn: config.jwt.expiresIn as StringValue },
  );

  const url = `${config.clientUrl}/reset-password?token=${token}`;


  await sendEmail(
    isUserExist.email,
    "Password Reset Request",
    `You requested a password reset. Click the link to reset your password: ${url}`,
    resetPasswordHtml(url),
  );
};

const resetPassword = async (payload: { token: string; newPassword: string }) => {
  const decoded = jwt.verify(payload.token, config.jwt.secret as string) as { email: string; role: string };

  const isUserExist = await prisma.user.findUnique({
    where: {
      email: decoded.email,
    },
  });

  if (!isUserExist) {
    throw new AppError(404, "User not found");
  }

  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.saltRounds),
  );

  await prisma.user.update({
    where: {
      email: decoded.email,
    },
    data: {
      password: hashedPassword,
    },
  });
}

export const AuthService = {
  loginUser,
  forgetPassword,
  resetPassword,
};