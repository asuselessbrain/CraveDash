import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { pagination } from "../../utils/pagination";
import { searching } from "../../utils/searching";
import { filtering } from "../../utils/filtering";

const mealInclude = {
    category: {
        include: {
            cuisine: true,
        },
    },
} satisfies Prisma.MealInclude;

const createMeal = async (payload: Prisma.MealUncheckedCreateInput, email: string) => {
    const result = await prisma.meal.create({
        data: {
            ...payload,
            providerEmail: email,
        },
        include: mealInclude,
    });
    return result;
};

const getProvidersMeals = async (query: Record<string, unknown>) => {
    const { searchTerm, skip, take, sortBy, sortOrder, availabilityStatus, mealType, dietaryTag, spiceLevel, categoryId, cuisineId } = query;
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

    // Apply additional field filtering
    const filterData: Record<string, any> = {};
    if (availabilityStatus) filterData.availabilityStatus = availabilityStatus;
    if (mealType) filterData.mealType = mealType;
    if (dietaryTag) filterData.dietaryTag = dietaryTag;
    if (spiceLevel) filterData.spiceLevel = spiceLevel;
    if (categoryId) filterData.categoryId = categoryId;
    if (cuisineId) filterData["category.cuisine.id"] = cuisineId;

    if (Object.keys(filterData).length > 0) {
        inputFilter = filtering(inputFilter, filterData) as Prisma.MealWhereInput[];
    }

    const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } =
        pagination(Number(skip), Number(take), safeSortBy, sortOrder === "asc" ? "asc" : "desc");

    const whereCondition: Prisma.MealWhereInput = inputFilter.length > 0 ? { AND: inputFilter } : {};

    const result = await prisma.meal.findMany({
        where: whereCondition,
        skip: skipValue,
        take: takeValue,
        orderBy: {
            [sortByField]: sortOrderValue,
        },
        include: mealInclude,
    });

    const total = await prisma.meal.count({
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
        data: result,
    };
};

const getMeals = async (query: Record<string, unknown>) => {
    const { searchTerm, skip, take, sortBy, sortOrder, availabilityStatus, mealType, dietaryTag, spiceLevel, categoryId, cuisineId, providerEmail } = query;
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

    // Apply additional field filtering
    const filterData: Record<string, any> = {};
    if (availabilityStatus) filterData.availabilityStatus = availabilityStatus;
    if (mealType) filterData.mealType = mealType;
    if (dietaryTag) filterData.dietaryTag = dietaryTag;
    if (spiceLevel) filterData.spiceLevel = spiceLevel;
    if (categoryId) filterData.categoryId = categoryId;
    if (cuisineId) filterData["category.cuisine.id"] = cuisineId;
    if (providerEmail) filterData.providerEmail = providerEmail;

    if (Object.keys(filterData).length > 0) {
        inputFilter = filtering(inputFilter, filterData) as Prisma.MealWhereInput[];
    }

    const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } =
        pagination(Number(skip), Number(take), safeSortBy, sortOrder === "asc" ? "asc" : "desc");

    const whereCondition: Prisma.MealWhereInput = inputFilter.length > 0 ? { AND: inputFilter } : {};

    const result = await prisma.meal.findMany({
        where: whereCondition,
        skip: skipValue,
        take: takeValue,
        orderBy: {
            [sortByField]: sortOrderValue,
        },
        include: mealInclude,
    });

    const total = await prisma.meal.count({
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