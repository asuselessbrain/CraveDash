import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { pagination } from "../../utils/pagination";
import { searching } from "../../utils/searching";

const mealInclude = {
    category: {
        include: {
            cuisine: true,
        },
    },
} satisfies Prisma.MealInclude;

const createMeal = async (payload: Prisma.MealUncheckedCreateInput) => {
    const result = await prisma.meal.create({
        data: payload,
        include: mealInclude,
    });
    return result;
};

const getProvidersMeals = async (query: Record<string, unknown>) => {
    const { searchTerm, skip, take, sortBy, sortOrder } = query;
    const allowedSortFields: Array<keyof Prisma.MealOrderByWithRelationInput> = [
        "id",
        "name",
        "price",
        "availabilityStatus",
        "preparationTime",
        "servingSize",
        "mealType",
        "dietaryTag",
        "spiceLevel",
        "stockQuantity",
        "createdAt",
        "updatedAt",
    ];

    const requestedSortField = typeof sortBy === "string" ? sortBy.trim() : "";
    const safeSortBy = allowedSortFields.includes(
        requestedSortField as keyof Prisma.MealOrderByWithRelationInput,
    )
        ? requestedSortField
        : "createdAt";

    let inputFilter: Prisma.MealWhereInput[] = [];

    if (searchTerm) {
        inputFilter = searching(inputFilter, ["name", "description", "category.name", "category.cuisine.name"], String(searchTerm));
    }

    const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } =
        pagination(Number(skip), Number(take), safeSortBy, sortOrder === "asc" ? "asc" : "desc");

    const result = await prisma.meal.findMany({
        where: {
            AND: inputFilter,
        },
        skip: skipValue,
        take: takeValue,
        orderBy: {
            [sortByField]: sortOrderValue,
        },
        include: mealInclude,
    });

    const total = await prisma.meal.count({
        where: {
            AND: inputFilter,
        },
    });

    const totalPages = Math.ceil(total / takeValue);

    return {
        meta: {
            currentPage,
            limit: takeValue,
            total,
            totalPages,
        },
        data: result,
    };
};

const getMeals = async (query: Record<string, unknown>) => {
    const { searchTerm, skip, take, sortBy, sortOrder } = query;
    const allowedSortFields: Array<keyof Prisma.MealOrderByWithRelationInput> = [
        "id",
        "name",
        "price",
        "availabilityStatus",
        "preparationTime",
        "servingSize",
        "mealType",
        "dietaryTag",
        "spiceLevel",
        "stockQuantity",
        "createdAt",
        "updatedAt",
    ];

    const requestedSortField = typeof sortBy === "string" ? sortBy.trim() : "";
    const safeSortBy = allowedSortFields.includes(
        requestedSortField as keyof Prisma.MealOrderByWithRelationInput,
    )
        ? requestedSortField
        : "createdAt";

    let inputFilter: Prisma.MealWhereInput[] = [];

    if (searchTerm) {
        inputFilter = searching(inputFilter, ["name", "description", "category.name", "category.cuisine.name"], String(searchTerm));
    }

    const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } =
        pagination(Number(skip), Number(take), safeSortBy, sortOrder === "asc" ? "asc" : "desc");

    const result = await prisma.meal.findMany({
        where: {
            AND: inputFilter,
        },
        skip: skipValue,
        take: takeValue,
        orderBy: {
            [sortByField]: sortOrderValue,
        },
        include: mealInclude,
    });

    const total = await prisma.meal.count({
        where: {
            AND: inputFilter,
        },
    });

    const totalPages = Math.ceil(total / takeValue);

    return {
        meta: {
            currentPage,
            limit: takeValue,
            total,
            totalPages,
        },
        data: result,
    };
};

const getMealById = async (id: string) => {
    const result = await prisma.meal.findUniqueOrThrow({
        where: { id },
        include: mealInclude,
    });
    return result;
};

const updateMeal = async (id: string, payload: Prisma.MealUncheckedUpdateInput) => {
    const result = await prisma.meal.update({
        where: { id },
        data: payload,
        include: mealInclude,
    });
    return result;
};

const deleteMeal = async (id: string) => {
    const result = await prisma.meal.delete({
        where: { id },
        include: mealInclude,
    });
    return result;
};

export const MealService = {
    createMeal,
    getProvidersMeals,
    getMeals,
    getMealById,
    updateMeal,
    deleteMeal,
};