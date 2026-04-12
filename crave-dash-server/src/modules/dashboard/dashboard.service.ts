import { OrderStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

type DashboardOrderStatusMeta = {
  label: string;
  tone: "success" | "info" | "warning" | "danger" | "neutral";
};

const orderStatusMeta: Record<keyof typeof OrderStatus, DashboardOrderStatusMeta> = {
  PENDING: {
    label: "Pending",
    tone: "warning",
  },
  CONFIRMED: {
    label: "Confirmed",
    tone: "info",
  },
  PREPARING: {
    label: "Preparing",
    tone: "warning",
  },
  SHIPPED: {
    label: "On the way",
    tone: "info",
  },
  DELIVERED: {
    label: "Delivered",
    tone: "success",
  },
  CANCELLED: {
    label: "Cancelled",
    tone: "danger",
  },
};

const activeOrderStatuses: Array<keyof typeof OrderStatus> = [
  "CONFIRMED",
  "PREPARING",
  "SHIPPED",
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
};

const formatDate = (value: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
};

const getCustomerDashboard = async (userEmail: string) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [customer, totalOrders, activeDeliveries, todayOrders, orderMealRows, recentOrders] =
    await Promise.all([
      prisma.customer.findUnique({
        where: { email: userEmail },
        select: {
          email: true,
          fullName: true,
          phone: true,
          address: true,
          city: true,
          profileImage: true,
          status: true,
        },
      }),
      prisma.order.count({
        where: { userEmail },
      }),
      prisma.order.count({
        where: {
          userEmail,
          orderStatus: {
            in: activeOrderStatuses,
          },
        },
      }),
      prisma.order.count({
        where: {
          userEmail,
          createdAt: {
            gte: startOfToday,
          },
        },
      }),
      prisma.orderItem.findMany({
        where: {
          order: {
            userEmail,
          },
        },
        select: {
          mealId: true,
        },
      }),
      prisma.order.findMany({
        where: {
          userEmail,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 3,
        include: {
          items: {
            include: {
              meal: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          },
          deliveryAddress: true,
        },
      }),
    ]);

  const savedMeals = new Set(orderMealRows.map((row) => row.mealId)).size;
  const rewardPoints = totalOrders * 20;
  const todayActivityCount = todayOrders + activeDeliveries;

  const overviewCards = [
    {
      key: "totalOrders",
      label: "Total Orders",
      value: totalOrders,
      formattedValue: String(totalOrders),
      description: "Across all time",
    },
    {
      key: "activeDeliveries",
      label: "Active Deliveries",
      value: activeDeliveries,
      formattedValue: String(activeDeliveries),
      description: "On the way right now",
    },
    {
      key: "savedMeals",
      label: "Saved Meals",
      value: savedMeals,
      formattedValue: String(savedMeals),
      description: "Quick reorders",
    },
    {
      key: "rewardPoints",
      label: "Reward Points",
      value: rewardPoints,
      formattedValue: String(rewardPoints),
      description: "Ready to redeem",
    },
  ];

  const mappedRecentOrders = recentOrders.map((order) => {
    const itemCount = order.items.reduce((acc, item) => acc + item.quantity, 0);
    const mealNames = order.items.map((item) => item.meal.name);
    const status = order.orderStatus as keyof typeof OrderStatus;
    const statusInfo = orderStatusMeta[status] ?? {
      label: order.orderStatus,
      tone: "neutral" as const,
    };

    return {
      id: order.id,
      orderNumber: `ORD-${order.id.replace(/-/g, "").slice(0, 8).toUpperCase()}`,
      createdAt: order.createdAt,
      dateLabel: formatDate(order.createdAt),
      itemCount,
      itemCountLabel: `${itemCount} item${itemCount === 1 ? "" : "s"}`,
      itemsPreview: mealNames.slice(0, 3).join(", "),
      mealNames,
      total: order.total,
      formattedTotal: formatCurrency(order.total),
      orderStatus: order.orderStatus,
      statusLabel: statusInfo.label,
      statusTone: statusInfo.tone,
      paymentStatus: order.paymentStatus,
      deliveryAddress: order.deliveryAddress,
    };
  });

  return {
    customer: customer ?? {
      email: userEmail,
      fullName: "Customer",
      phone: null,
      address: null,
      city: null,
      profileImage: null,
      status: "ACTIVE",
    },
    greeting: {
      title: `Welcome back, ${customer?.fullName ?? "Customer"}`,
      subtitle: "Track your orders, update your profile, and keep your food journey organized from one place.",
    },
    sidebar: {
      label: "Today",
      activeCount: todayActivityCount,
      description: "Current customer activities",
    },
    overviewCards,
    recentOrders: mappedRecentOrders,
    quickActions: [
      {
        label: "Manage profile",
        href: "/profile",
        icon: "user",
      },
      {
        label: "Track orders",
        href: "/orders",
        icon: "truck",
      },
      {
        label: "Browse meals",
        href: "/meals",
        icon: "heart",
      },
      {
        label: "Open cart",
        href: "/cart",
        icon: "cart",
      },
    ],
    accountTip: {
      label: "Account Tip",
      title: "Keep your profile updated",
      description: "Your saved address and phone number help speed up every delivery.",
    },
  };
};

export const DashboardService = {
  getCustomerDashboard,
};