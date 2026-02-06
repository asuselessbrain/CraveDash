import { config } from "../../config";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { CustomerInput } from "./customerValidationSchema";
import { Role } from "../../../generated/prisma/enums";

const createCustomer = async (data: CustomerInput) => {
  const hashedPassword = await bcrypt.hash(
    data.password,
    Number(config.saltRounds),
  );
  data.password = hashedPassword;

  const useData = {
    email: data.email,
    password: data.password,
    role: Role.CUSTOMER,
  };

  const customerData = {
    email: data.email,
    fullName: data.fullName,
    phone: data.phoneNumber ?? null,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: useData,
    });

    const customer = await transactionClient.customer.create({
      data: customerData,
    });
    return customer;
  });
  return result;
};

export const UserService = {
  createCustomer,
};
