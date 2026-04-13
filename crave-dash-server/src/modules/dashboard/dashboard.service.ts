import { MealAvailabilityStatus, OrderStatus, Role, UserStatus } from "../../../generated/prisma/enums";
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

const formatChartDay = (value: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
  }).format(value);
};

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
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

const getAdminDashboard = async () => {
  const today = new Date();
  const startOfToday = new Date(today);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - 6);

  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + index);
    return day;
  });

  const [totalUsers, totalProviders, totalCustomers, totalOrders, totalRevenue, suspendedUsers, pendingOrders, unavailableMeals, recentOrders, weeklyRevenue, recentUsers] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          role: Role.PROVIDER,
        },
      }),
      prisma.user.count({
        where: {
          role: Role.CUSTOMER,
        },
      }),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: {
          total: true,
        },
      }),
      prisma.user.count({
        where: {
          status: UserStatus.SUSPENDED,
        },
      }),
      prisma.order.count({
        where: {
          orderStatus: OrderStatus.PENDING,
        },
      }),
      prisma.meal.count({
        where: {
          availabilityStatus: MealAvailabilityStatus.UNAVAILABLE,
        },
      }),
      prisma.order.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 4,
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
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: startOfWeek,
          },
        },
        select: {
          createdAt: true,
          total: true,
        },
      }),
      prisma.user.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 4,
        select: {
          email: true,
          role: true,
          createdAt: true,
          customer: {
            select: {
              fullName: true,
            },
          },
        },
      }),
    ]);

  const weeklyOrdersData = weekDays.map((day) => {
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const ordersForDay = weeklyRevenue.filter(
      (order) => order.createdAt >= dayStart && order.createdAt < dayEnd,
    ).length;

    const revenueForDay = weeklyRevenue
      .filter((order) => order.createdAt >= dayStart && order.createdAt < dayEnd)
      .reduce((acc, order) => acc + toNumber(order.total), 0);

    return {
      label: formatChartDay(day),
      orders: ordersForDay,
      revenue: revenueForDay,
      formattedRevenue: formatCurrency(revenueForDay),
    };
  });

  const mappedRecentOrders = recentOrders.map((order) => {
    const itemCount = order.items.reduce((acc, item) => acc + item.quantity, 0);
    const customerName = order.user.customer?.fullName ?? order.user.email;
    const status = order.orderStatus as keyof typeof OrderStatus;
    const statusInfo = orderStatusMeta[status] ?? {
      label: order.orderStatus,
      tone: "neutral" as const,
    };

    return {
      id: order.id,
      orderNumber: `AO-${order.id.replace(/-/g, "").slice(0, 6).toUpperCase()}`,
      customerName,
      customerEmail: order.user.email,
      itemCount,
      total: toNumber(order.total),
      formattedTotal: formatCurrency(toNumber(order.total)),
      orderStatus: order.orderStatus,
      statusLabel: statusInfo.label,
      statusTone: statusInfo.tone,
      createdAt: order.createdAt,
      dateLabel: formatDate(order.createdAt),
    };
  });

  const recentActivity = recentUsers.map((user) => ({
    label: user.customer?.fullName ?? user.email,
    description: `${user.role} • ${formatDate(user.createdAt)}`,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  }));

  const totalRevenueValue = toNumber(totalRevenue._sum.total);
  const systemIsHealthy = suspendedUsers === 0 && pendingOrders < 20 && unavailableMeals < 10;

  return {
    greeting: {
      title: "Platform Overview",
      subtitle: "Monitor the marketplace, track performance, and review live activity across users, orders, and providers.",
    },
    sidebar: {
      label: "System Status",
      status: systemIsHealthy ? "Healthy" : "Needs Attention",
      description: systemIsHealthy ? "All services operational" : "Some areas need review",
    },
    overviewCards: [
      {
        key: "totalUsers",
        label: "Total Users",
        value: totalUsers,
        formattedValue: String(totalUsers),
        description: "All registered accounts",
      },
      {
        key: "totalOrders",
        label: "Total Orders",
        value: totalOrders,
        formattedValue: String(totalOrders),
        description: "All marketplace orders",
      },
      {
        key: "totalProviders",
        label: "Total Providers",
        value: totalProviders,
        formattedValue: String(totalProviders),
        description: "Active service providers",
      },
      {
        key: "totalRevenue",
        label: "Total Revenue",
        value: totalRevenueValue,
        formattedValue: formatCurrency(totalRevenueValue),
        description: "Gross platform revenue",
      },
    ],
    metrics: {
      totalCustomers,
      suspendedUsers,
      pendingOrders,
      unavailableMeals,
    },
    charts: {
      weeklyOrders: weeklyOrdersData.map((day) => ({
        label: day.label,
        value: day.orders,
      })),
      weeklyRevenue: weeklyOrdersData.map((day) => ({
        label: day.label,
        value: day.revenue,
        formattedValue: day.formattedRevenue,
      })),
    },
    recentActivity: mappedRecentOrders,
    recentUsers: recentActivity,
    quickActions: [
      {
        label: "Manage Users",
        href: "/users",
        icon: "users",
      },
      {
        label: "Manage Orders",
        href: "/orders",
        icon: "orders",
      },
      {
        label: "Manage Categories",
        href: "/categories",
        icon: "categories",
      },
    ],
  };
};

export const DashboardService = {
  getCustomerDashboard,
  getProviderDashboard,
  getAdminDashboard,
};