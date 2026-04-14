import { config } from "../../config";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { CustomerInput } from "./customerValidationSchema";
import { Role, UserStatus } from "../../../generated/prisma/enums";
import { Prisma } from "../../../generated/prisma/client";
import jwt from "jsonwebtoken";
import { StringValue } from "ms";
import AppError from "../../errors/appError";
import { pagination } from "../../utils/pagination";
import { filtering } from "../../utils/filtering";

type AdminCreateUserPayload = {
  email: string;
  password: string;
  role: Role;
  fullName?: string;
  phone?: string;
};

type AdminUpdateUserPayload = {
  role?: Role;
  status?: UserStatus;
};

const createCustomer = async (data: CustomerInput) => {

  const hashedPassword = await bcrypt.hash(
    data.password,
    Number(config.saltRounds),
  );
  data.password = hashedPassword;

  const useData = {
    email: data.email,
    password: data.password,
    role: data.role ?? Role.CUSTOMER,
  };

  const customerData = {
    email: data.email,
    fullName: data.fullName,
    phone: data.phoneNumber ?? null,
  };
  await prisma.user.create({ data: useData });

  const customer = await prisma.customer.create({
    data: customerData,
  })


  const token = jwt.sign(
    { email: customerData.email, role: useData.role },
    String(config.jwt.secret),
    { expiresIn: config.jwt.expiresIn as StringValue },
  );

  return {
    customer,
    token,
  };
};

const getAdminUsers = async (query: Record<string, unknown>) => {
  const { searchTerm, role, status, skip, take, sortBy, sortOrder } = query;

  const allowedSortFields: Array<keyof Prisma.UserOrderByWithRelationInput> = [
    "id",
    "email",
    "role",
    "status",
    "createdAt",
    "updatedAt",
  ];

  const requestedSortField = typeof sortBy === "string" ? sortBy.trim() : "";
  const safeSortBy = allowedSortFields.includes(
    requestedSortField as keyof Prisma.UserOrderByWithRelationInput,
  )
    ? requestedSortField
    : "createdAt";

  let inputFilter: Prisma.UserWhereInput[] = [];

  // Apply additional field filtering
  const filterData: Record<string, any> = {};
  if (role) filterData.role = role;
  if (status) filterData.status = status;

  if (Object.keys(filterData).length > 0) {
    inputFilter = filtering(inputFilter, filterData) as Prisma.UserWhereInput[];
  }

  if (typeof searchTerm === "string" && searchTerm.trim().length > 0) {
    inputFilter.push({
      OR: [
        { email: { contains: searchTerm, mode: "insensitive" } },
        { customer: { fullName: { contains: searchTerm, mode: "insensitive" } } },
        { customer: { phone: { contains: searchTerm, mode: "insensitive" } } },
      ],
    });
  }

  const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } = pagination(
    Number(skip),
    Number(take),
    safeSortBy,
    sortOrder === "asc" ? "asc" : "desc",
  );

  const whereCondition: Prisma.UserWhereInput = inputFilter.length > 0 ? { AND: inputFilter } : {};

  const users = await prisma.user.findMany({
    where: whereCondition,
    skip: skipValue,
    take: takeValue,
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      customer: {
        select: {
          fullName: true,
          phone: true,
          city: true,
          profileImage: true,
          status: true,
        },
      },
      _count: {
        select: {
          orders: true,
          meals: true,
          carts: true,
        },
      },
    },
    orderBy: {
      [sortByField]: sortOrderValue,
    },
  });

  const formattedUsers = users.map((user) => ({
    ...user,
    fullName: user.customer?.fullName ?? null,
  }));

  const total = await prisma.user.count({
    where: whereCondition,
  });

  const totalPages = Math.ceil(total / takeValue);

  return {
    meta: {
      currentPage,
      limit: takeValue,
      total,
      totalPages,
    },
    data: formattedUsers,
  };
};

const getAdminUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      customer: true,
      _count: {
        select: {
          orders: true,
          meals: true,
          carts: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return {
    ...user,
    fullName: user.customer?.fullName ?? null,
  };
};

const createUserByAdmin = async (payload: AdminCreateUserPayload) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
    select: { id: true },
  });

  if (existingUser) {
    throw new AppError(409, "User already exists with this email");
  }

  const hashedPassword = await bcrypt.hash(payload.password, Number(config.saltRounds));

  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {
        email: payload.email,
        password: hashedPassword,
        role: payload.role,
      },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    if (payload.role === Role.CUSTOMER) {
      await tx.customer.create({
        data: {
          email: payload.email,
          fullName: payload.fullName?.trim() || "Customer",
          phone: payload.phone ?? null,
        },
      });
    }

    return createdUser;
  });

  return user;
};

const updateUserByAdmin = async (userId: string, payload: AdminUpdateUserPayload, adminEmail: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.email === adminEmail && payload.role && payload.role !== Role.ADMIN) {
    throw new AppError(400, "Admin cannot change own role");
  }

  const updateData: Prisma.UserUpdateInput = {};

  if (payload.role) {
    updateData.role = payload.role;
  }

  if (payload.status) {
    updateData.status = payload.status;
  }

  if (!Object.keys(updateData).length) {
    throw new AppError(400, "Nothing to update");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      customer: {
        select: {
          fullName: true,
          phone: true,
        },
      },
    },
  });

  return {
    ...updatedUser,
    fullName: updatedUser.customer?.fullName ?? null,
  };
};

const blockUserByAdmin = async (userId: string, adminEmail: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
    },
  });


  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.email === adminEmail) {
    throw new AppError(400, "Admin cannot block own account");
  }

  if (user.status === UserStatus.SUSPENDED) {
    throw new AppError(400, "User is already blocked");
  }

  const blockedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      status: UserStatus.SUSPENDED,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      customer: {
        select: {
          fullName: true,
        },
      },
    },
  });

  return {
    ...blockedUser,
    fullName: blockedUser.customer?.fullName ?? null,
  };
};

export const UserService = {
  createCustomer,
  getAdminUsers,
  getAdminUserById,
  createUserByAdmin,
  updateUserByAdmin,
  blockUserByAdmin,
};
