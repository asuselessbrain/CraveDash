import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { pagination } from "../../utils/pagination";
import { searching } from "../../utils/searching";
import { filtering } from "../../utils/filtering";

const attachCuisineCounts = async <T extends { id: string; _count?: { categories: number } }>(cuisines: T[]) => {
    if (!cuisines.length) {
        return cuisines.map((cuisine) => ({
            ...cuisine,
            categoriesCount: 0,
            categories: 0,
            mealsCount: 0,
            meals: 0,
        }));
    }

    const cuisineIds = cuisines.map((cuisine) => cuisine.id);

    const categories = await prisma.category.findMany({
        where: {
            cuisineId: {
                in: cuisineIds,
            },
        },
        select: {
            cuisineId: true,
            _count: {
                select: {
                    meals: true,
                },
            },
        },
    });

    const mealCountByCuisine = new Map<string, number>();

    categories.forEach((category) => {
        const current = mealCountByCuisine.get(category.cuisineId) ?? 0;
        mealCountByCuisine.set(category.cuisineId, current + category._count.meals);
    });

    return cuisines.map((cuisine) => {
        const categoriesCount = cuisine._count?.categories ?? 0;
        const mealsCount = mealCountByCuisine.get(cuisine.id) ?? 0;

        return {
            ...cuisine,
            categoriesCount,
            categories: categoriesCount,
            mealsCount,
            meals: mealsCount,
        };
    });
};

const createCuisine = async (payload: Prisma.CuisineCreateInput) => {
    const result = await prisma.cuisine.create({
        data: payload
    })
    return result;
}

const getCuisines = async (query: Record<string, unknown>) => {

    const { searchTerm, skip, take, sortBy, sortOrder, status } = query;
    const allowedSortFields: Array<keyof Prisma.CuisineOrderByWithRelationInput> = [
        "id",
        "name",
        "image",
        "status",
        "createdAt",
        "updatedAt",
    ];

    const requestedSortField = typeof sortBy === "string" ? sortBy.trim() : "";
    const safeSortBy = allowedSortFields.includes(requestedSortField as keyof Prisma.CuisineOrderByWithRelationInput)
        ? requestedSortField
        : "createdAt";

    let inputFilter: Prisma.CuisineWhereInput[] = [];

    if (searchTerm) {
        inputFilter = searching(inputFilter, ["name"], String(searchTerm));
    }

    // Apply additional field filtering
    const filterData: Record<string, any> = {};
    if (status) filterData.status = status;

    if (Object.keys(filterData).length > 0) {
        inputFilter = filtering(inputFilter, filterData) as Prisma.CuisineWhereInput[];
    }

    const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } =
        pagination(Number(skip), Number(take), safeSortBy, sortOrder === "asc" ? "asc" : "desc");

    const whereCondition: Prisma.CuisineWhereInput = inputFilter.length > 0 ? { AND: inputFilter } : {};

    const result = await prisma.cuisine.findMany({
        where: whereCondition,
        skip: skipValue,
        take: takeValue,
        include: {
            _count: {
                select: {
                    categories: true,
                },
            },
        },
        orderBy: {
            [sortByField]: sortOrderValue
        }
    });

    const mappedResult = await attachCuisineCounts(result);

    const total = await prisma.cuisine.count({
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
        data: mappedResult,
    };
};

const getAllCuisinesForCategory = async () => {
    const result = await prisma.cuisine.findMany({
        include: {
            _count: {
                select: {
                    categories: true,
                },
            },
        },
    })
    return await attachCuisineCounts(result);
}

const getAllCuisinesForFiltering = async () => {
    const result = await prisma.cuisine.findMany({
        include: {
            _count: {
                select: {
                    categories: true,
                },
            },
        },
    });
    return await attachCuisineCounts(result);
};

export const CuisineService = {
    createCuisine,
    getCuisines,
    getAllCuisinesForCategory,
    getAllCuisinesForFiltering
}