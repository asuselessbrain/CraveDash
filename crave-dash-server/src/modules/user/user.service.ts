import { config } from "../../config";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { CustomerInput } from "./customerValidationSchema";
import { Role } from "../../../generated/prisma/enums";
import jwt from "jsonwebtoken";
import { StringValue } from "ms";

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



  const user = await prisma.user.create({ data: useData });

  const customer = await prisma.customer.create({
    data: customerData,
  });


  const token = jwt.sign(
    { email: customerData.email, role: useData.role },
    String(config.jwt.secret),
    { expiresIn: config.jwt.expiresIn as StringValue },
  );

  return { ...customer, token };
};

export const UserService = {
  createCustomer,
};
