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

  const [customer, totalOrders, activeDeliveries, todayOrders, cartItems, recentOrders] =
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
      prisma.cart.findMany({
        where: {
          userEmail,
        },
        select: {
          quantity: true,
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

  const savedMeals = cartItems.reduce((acc, item) => acc + item.quantity, 0);
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

const getProviderDashboard = async (providerEmail: string) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [provider, totalOrders, todayOrders, activeMeals, orderData, recentOrders] =
    await Promise.all([
      // Get provider info
      prisma.user.findUnique({
        where: { email: providerEmail },
        select: {
          email: true,
          role: true,
          createdAt: true,
        },
      }),
      // Count total orders where provider's meals are included
      prisma.order.count({
        where: {
          items: {
            some: {
              meal: {
                providerEmail,
              },
            },
          },
        },
      }),
      // Count today's orders
      prisma.order.count({
        where: {
          items: {
            some: {
              meal: {
                providerEmail,
              },
            },
          },
          createdAt: {
            gte: startOfToday,
          },
        },
      }),
      // Count active meals
      prisma.meal.count({
        where: {
          providerEmail,
          availabilityStatus: "AVAILABLE",
        },
      }),
      // Get revenue data from order items
      prisma.orderItem.findMany({
        where: {
          meal: {
            providerEmail,
          },
        },
        select: {
          price: true,
          quantity: true,
        },
      }),
      // Get recent orders with provider's items
      prisma.order.findMany({
        where: {
          items: {
            some: {
              meal: {
                providerEmail,
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        include: {
          user: {
            select: {
              email: true,
              customer: {
                select: {
                  fullName: true,
                },
              },
            },
          },
          items: {
            where: {
              meal: {
                providerEmail,
              },
            },
            include: {
              meal: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),
    ]);

  const totalRevenue = orderData.reduce((acc, item) => {
    return acc + Number(item.price) * item.quantity;
  }, 0);

  const performanceScore = 4.8;

  const overviewCards = [
    {
      key: "totalOrders",
      label: "Total Orders",
      value: totalOrders,
      formattedValue: String(totalOrders),
      description: "All time orders",
    },
    {
      key: "todayOrders",
      label: "Today's Orders",
      value: todayOrders,
      formattedValue: String(todayOrders),
      description: "Incoming today",
    },
    {
      key: "totalRevenue",
      label: "Total Revenue",
      value: totalRevenue,
      formattedValue: formatCurrency(totalRevenue),
      description: "From all orders",
    },
    {
      key: "activeMeals",
      label: "Active Meals",
      value: activeMeals,
      formattedValue: String(activeMeals),
      description: "Available now",
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
      orderNumber: `PO-${order.id.replace(/-/g, "").slice(0, 6).toUpperCase()}`,
      customerEmail: order.user.email,
      customerName: order.user.customer?.fullName ?? "Customer",
      itemCount,
      mealNames,
      total: order.total,
      formattedTotal: formatCurrency(order.total),
      orderStatus: order.orderStatus,
      statusLabel: statusInfo.label,
      statusTone: statusInfo.tone,
    };
  });

  return {
    provider: provider ?? {
      email: providerEmail,
      role: "PROVIDER",
      createdAt: new Date(),
    },
    greeting: {
      title: "Business Overview",
      subtitle: "Monitor performance, review recent activity, and jump straight into operational tasks.",
    },
    sidebar: {
      label: "Today",
      performanceScore,
      scoreDescription: "Provider performance score",
    },
    overviewCards,
    recentOrders: mappedRecentOrders,
    quickActions: [
      {
        label: "Manage Menu",
        href: "/meals",
        icon: "menu",
      },
      {
        label: "Review Orders",
        href: "/orders",
        icon: "orders",
      },
      {
        label: "Add New Meal",
        href: "/meals/create",
        icon: "plus",
      },
    ],
  };
};

export const DashboardService = {
  getCustomerDashboard,
  getProviderDashboard,
};