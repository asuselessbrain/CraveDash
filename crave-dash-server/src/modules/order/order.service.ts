import { OrderStatus, PaymentMethod, Role } from "../../../generated/prisma/enums";
import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import AppError from "../../errors/appError";
import { pagination } from "../../utils/pagination";
import { searching } from "../../utils/searching";
import { filtering } from "../../utils/filtering";

type CreateOrderPayload = {
  fullName?: string;
  phoneNumber?: string;
  city?: string;
  area?: string;
  streetAddress?: string;
  deliveryInstructions?: string;
  deliveryAddress?: {
    fullName?: string;
    phoneNumber?: string;
    city?: string;
    area?: string;
    streetAddress?: string;
    deliveryInstructions?: string;
  };
  paymentMethod?: PaymentMethod;
};

type UpdateProviderOrderStatusPayload = {
  orderStatus: keyof typeof OrderStatus;
};

const createOrder = async (payload: CreateOrderPayload, userEmail: string) => {
  const deliveryAddressPayload = payload.deliveryAddress ?? {};

  const fullName = payload.fullName ?? deliveryAddressPayload.fullName;
  const phoneNumber = payload.phoneNumber ?? deliveryAddressPayload.phoneNumber;
  const city = payload.city ?? deliveryAddressPayload.city;
  const area = payload.area ?? deliveryAddressPayload.area;
  const streetAddress = payload.streetAddress ?? deliveryAddressPayload.streetAddress;
  const deliveryInstructions = payload.deliveryInstructions ?? deliveryAddressPayload.deliveryInstructions;

  if (!fullName || !phoneNumber || !city || !area || !streetAddress) {
    throw new AppError(400, "Delivery address is incomplete");
  }

  const cartItems = await prisma.cart.findMany({
    where: { userEmail },
    include: {
      meal: {
        select: {
          id: true,
          name: true,
          price: true,
        },
      },
    },
  });

  if (!cartItems.length) {
    throw new AppError(400, "Cart is empty");
  }

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + Number(item.meal.price) * item.quantity;
  }, 0);

  const deliveryFee = 120;
  const total = subtotal + deliveryFee;

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        userEmail,
        subtotal,
        deliveryFee,
        total,
        paymentMethod: payload.paymentMethod ?? PaymentMethod.CASH_ON_DELIVERY,
        items: {
          create: cartItems.map((item) => ({
            mealId: item.mealId,
            quantity: item.quantity,
            price: Number(item.meal.price),
          })),
        },
        deliveryAddress: {
          create: {
            fullName,
            phoneNumber,
            city,
            area,
            streetAddress,
            deliveryInstructions: deliveryInstructions ?? null,
          },
        },
      },
      include: {
        items: {
          include: {
            meal: {
              select: {
                id: true,
                name: true,
                image: true,
                price: true,
              },
            },
          },
        },
        deliveryAddress: true,
      },
    });

    await tx.cart.deleteMany({
      where: { userEmail },
    });

    return createdOrder;
  });

  return order;
};

const getMyOrders = async (userEmail: string, query: Record<string, unknown>) => {
  const { searchTerm, skip, take, sortBy, sortOrder, orderStatus, status, paymentStatus, paymentMethod } = query;
  const allowedSortFields: Array<keyof Prisma.OrderOrderByWithRelationInput> = [
    "id",
    "userEmail",
    "subtotal",
    "deliveryFee",
    "total",
    "paymentMethod",
    "paymentStatus",
    "orderStatus",
    "createdAt",
    "updatedAt",
  ];

  const requestedSortField = typeof sortBy === "string" ? sortBy.trim() : "";
  const safeSortBy = allowedSortFields.includes(
    requestedSortField as keyof Prisma.OrderOrderByWithRelationInput,
  )
    ? requestedSortField
    : "createdAt";

  let inputFilter: Prisma.OrderWhereInput[] = [
    {
      userEmail,
    },
  ];

  // Apply text search filtering
  if (searchTerm) {
    inputFilter = searching(
      inputFilter,
      ["id", "deliveryAddress.fullName", "deliveryAddress.phoneNumber", "deliveryAddress.city", "deliveryAddress.area"],
      String(searchTerm),
    ) as Prisma.OrderWhereInput[];
  }

  // Apply additional field filtering
  const filterData: Record<string, any> = {};
  if (orderStatus || status) filterData.orderStatus = orderStatus ?? status;
  if (paymentStatus) filterData.paymentStatus = paymentStatus;
  if (paymentMethod) filterData.paymentMethod = paymentMethod;

  if (Object.keys(filterData).length > 0) {
    inputFilter = filtering(inputFilter, filterData) as Prisma.OrderWhereInput[];
  }

  const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } = pagination(
    Number(skip),
    Number(take),
    safeSortBy,
    sortOrder === "asc" ? "asc" : "desc",
  );

  const whereCondition: Prisma.OrderWhereInput = inputFilter.length > 0 ? { AND: inputFilter } : {};

  const orders = await prisma.order.findMany({
    where: whereCondition,
    skip: skipValue,
    take: takeValue,
    include: {
      items: {
        include: {
          meal: {
            select: {
              id: true,
              name: true,
              image: true,
              price: true,
              providerEmail: true,
            },
          },
        },
      },
      deliveryAddress: true,
    },
    orderBy: {
      [sortByField]: sortOrderValue,
    },
  });

  const total = await prisma.order.count({
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
    data: orders,
  };
};

const getProvidersOrders = async (providerEmail: string, query: Record<string, unknown>) => {
  const { searchTerm, skip, take, sortBy, sortOrder, orderStatus, status, paymentStatus, paymentMethod } = query;
  const allowedSortFields: Array<keyof Prisma.OrderOrderByWithRelationInput> = [
    "id",
    "userEmail",
    "subtotal",
    "deliveryFee",
    "total",
    "paymentMethod",
    "paymentStatus",
    "orderStatus",
    "createdAt",
    "updatedAt",
  ];

  const requestedSortField = typeof sortBy === "string" ? sortBy.trim() : "";
  const safeSortBy = allowedSortFields.includes(
    requestedSortField as keyof Prisma.OrderOrderByWithRelationInput,
  )
    ? requestedSortField
    : "createdAt";

  let inputFilter: Prisma.OrderWhereInput[] = [
    {
      items: {
        some: {
          meal: {
            providerEmail,
          },
        },
      },
    },
  ];

  // Apply text search filtering
  if (searchTerm) {
    inputFilter = searching(
      inputFilter,
      ["id", "deliveryAddress.fullName", "deliveryAddress.phoneNumber", "deliveryAddress.city", "deliveryAddress.area", "userEmail"],
      String(searchTerm),
    ) as Prisma.OrderWhereInput[];
  }

  // Apply additional field filtering
  const filterData: Record<string, any> = {};
  if (orderStatus || status) filterData.orderStatus = orderStatus ?? status;
  if (paymentStatus) filterData.paymentStatus = paymentStatus;
  if (paymentMethod) filterData.paymentMethod = paymentMethod;

  if (Object.keys(filterData).length > 0) {
    inputFilter = filtering(inputFilter, filterData) as Prisma.OrderWhereInput[];
  }

  const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } = pagination(
    Number(skip),
    Number(take),
    safeSortBy,
    sortOrder === "asc" ? "asc" : "desc",
  );

  const whereCondition: Prisma.OrderWhereInput = inputFilter.length > 0 ? { AND: inputFilter } : {};

  const orders = await prisma.order.findMany({
    where: whereCondition,
    skip: skipValue,
    take: takeValue,
    include: {
      items: {
        where: {
          meal: {
            providerEmail,
          },
        },
        include: {
          meal: {
            select: {
              id: true,
              name: true,
              image: true,
              price: true,
              providerEmail: true,
            },
          },
        },
      },
      deliveryAddress: true,
    },
    orderBy: {
      [sortByField]: sortOrderValue,
    },
  });

  const total = await prisma.order.count({
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
    data: orders,
  };
};

const getAdminOrders = async (query: Record<string, unknown>) => {
  const { searchTerm, skip, take, sortBy, sortOrder, orderStatus, status, paymentStatus, paymentMethod, userEmail, providerEmail } = query;
  const allowedSortFields: Array<keyof Prisma.OrderOrderByWithRelationInput> = [
    "id",
    "userEmail",
    "subtotal",
    "deliveryFee",
    "total",
    "paymentMethod",
    "paymentStatus",
    "orderStatus",
    "createdAt",
    "updatedAt",
  ];

  const requestedSortField = typeof sortBy === "string" ? sortBy.trim() : "";
  const safeSortBy = allowedSortFields.includes(
    requestedSortField as keyof Prisma.OrderOrderByWithRelationInput,
  )
    ? requestedSortField
    : "createdAt";

  let inputFilter: Prisma.OrderWhereInput[] = [];

  // Apply text search filtering
  if (searchTerm) {
    inputFilter = searching(
      inputFilter,
      ["id", "userEmail", "deliveryAddress.fullName", "deliveryAddress.phoneNumber", "deliveryAddress.city", "deliveryAddress.area"],
      String(searchTerm),
    ) as Prisma.OrderWhereInput[];
  }

  // Apply additional field filtering
  const filterData: Record<string, any> = {};
  if (orderStatus || status) filterData.orderStatus = orderStatus ?? status;
  if (paymentStatus) filterData.paymentStatus = paymentStatus;
  if (paymentMethod) filterData.paymentMethod = paymentMethod;
  if (userEmail) filterData.userEmail = userEmail;
  if (providerEmail) {
    filterData["items.some.meal.providerEmail"] = providerEmail;
  }

  if (Object.keys(filterData).length > 0) {
    inputFilter = filtering(inputFilter, filterData) as Prisma.OrderWhereInput[];
  }

  const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } = pagination(
    Number(skip),
    Number(take),
    safeSortBy,
    sortOrder === "asc" ? "asc" : "desc",
  );

  const whereCondition: Prisma.OrderWhereInput = inputFilter.length > 0 ? { AND: inputFilter } : {};

  const orders = await prisma.order.findMany({
    where: whereCondition,
    skip: skipValue,
    take: takeValue,
    include: {
      user: {
        select: {
          email: true,
          role: true,
          customer: {
            select: {
              fullName: true,
            },
          },
        },
      },
      items: {
        include: {
          meal: {
            select: {
              id: true,
              name: true,
              image: true,
              price: true,
              providerEmail: true,
            },
          },
        },
      },
      deliveryAddress: true,
    },
    orderBy: {
      [sortByField]: sortOrderValue,
    },
  });

  const total = await prisma.order.count({
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
    data: orders,
  };
};

const getOrderById = async (orderId: string, userEmail: string, role: Role) => {
  const commonInclude: Prisma.OrderInclude = {
    items: {
      include: {
        meal: {
          select: {
            id: true,
            name: true,
            image: true,
            price: true,
            providerEmail: true,
          },
        },
      },
    },
    deliveryAddress: true,
  };

  if (role === Role.ADMIN) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: commonInclude,
    });

    if (!order) {
      throw new AppError(404, "Order not found");
    }

    return order;
  }

  if (role === Role.CUSTOMER) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userEmail,
      },
      include: commonInclude,
    });

    if (!order) {
      throw new AppError(404, "Order not found");
    }

    return order;
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      items: {
        some: {
          meal: {
            providerEmail: userEmail,
          },
        },
      },
    },
    include: {
      items: {
        where: {
          meal: {
            providerEmail: userEmail,
          },
        },
        include: {
          meal: {
            select: {
              id: true,
              name: true,
              image: true,
              price: true,
              providerEmail: true,
            },
          },
        },
      },
      deliveryAddress: true,
    },
  });

  if (!order) {
    throw new AppError(404, "Order not found");
  }

  return order;
};

const providerAllowedStatuses: Array<keyof typeof OrderStatus> = [
  "CONFIRMED",
  "PREPARING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const orderStatusTransitions: Record<keyof typeof OrderStatus, Array<keyof typeof OrderStatus>> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

const updateProviderOrderStatus = async (
  orderId: string,
  payload: UpdateProviderOrderStatusPayload,
  userEmail: string,
  role: Role,
) => {
  const requestedStatus = payload.orderStatus;

  if (!providerAllowedStatuses.includes(requestedStatus)) {
    throw new AppError(400, "Invalid order status for provider update");
  }

  const order =
    role === Role.ADMIN
      ? await prisma.order.findUnique({
          where: { id: orderId },
        })
      : await prisma.order.findFirst({
          where: {
            id: orderId,
            items: {
              some: {
                meal: {
                  providerEmail: userEmail,
                },
              },
            },
          },
        });

  if (!order) {
    throw new AppError(404, "Order not found");
  }

  const currentStatus = order.orderStatus as keyof typeof OrderStatus;
  const allowedNextStatuses = orderStatusTransitions[currentStatus] ?? [];

  if (!allowedNextStatuses.includes(requestedStatus)) {
    throw new AppError(400, `Order status cannot be updated from ${currentStatus} to ${requestedStatus}`);
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      orderStatus: requestedStatus,
    },
    include: {
      items: {
        include: {
          meal: {
            select: {
              id: true,
              name: true,
              image: true,
              price: true,
              providerEmail: true,
            },
          },
        },
      },
      deliveryAddress: true,
    },
  });

  return updatedOrder;
};



export const OrderService = {
  createOrder,
  getMyOrders,
  getProvidersOrders,
  getAdminOrders,
  getOrderById,
  updateProviderOrderStatus,
};
