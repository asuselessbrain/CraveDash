import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { pagination } from "../../utils/pagination";
import { searching } from "../../utils/searching";
import { filtering } from "../../utils/filtering";

const createCategory = async (payload: Prisma.CategoryCreateInput) => {
    const result = await prisma.category.create({
        data: payload
    })
    return result;
}

const getCategories = async (query: Record<string, unknown>) => {

    const { searchTerm, skip, take, sortBy, sortOrder, status, cuisineId } = query;
    const allowedSortFields: Array<keyof Prisma.CategoryOrderByWithRelationInput> = [
        "id",
        "name",
        "image",
        "status",
        "createdAt",
        "updatedAt",
    ];

    const requestedSortField = typeof sortBy === "string" ? sortBy.trim() : "";
    const safeSortBy = allowedSortFields.includes(requestedSortField as keyof Prisma.CategoryOrderByWithRelationInput)
        ? requestedSortField
        : "createdAt";

    let inputFilter: Prisma.CategoryWhereInput[] = [];

    if (searchTerm) {
        inputFilter = searching(inputFilter, ["name", "cuisine.name"], String(searchTerm));
    }

    // Apply additional field filtering
    const filterData: Record<string, any> = {};
    if (status) filterData.status = status;
    if (cuisineId) filterData.cuisineId = cuisineId;

    if (Object.keys(filterData).length > 0) {
        inputFilter = filtering(inputFilter, filterData) as Prisma.CategoryWhereInput[];
    }

    const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } =
        pagination(Number(skip), Number(take), safeSortBy, sortOrder === "asc" ? "asc" : "desc");

    const whereCondition: Prisma.CategoryWhereInput = inputFilter.length > 0 ? { AND: inputFilter } : {};

    const result = await prisma.category.findMany({
        where: whereCondition,
        skip: skipValue,
        take: takeValue,
        include: {
            _count: {
                select: {
                    meals: true,
                },
            },
        },
        orderBy: {
            [sortByField]: sortOrderValue
        }
    });

    const mappedResult = result.map((category) => ({
        ...category,
        mealsCount: category._count.meals,
        meals: category._count.meals,
    }));

    const total = await prisma.category.count({
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

const getAllCategoriesForSlider = async () => {
    const result = await prisma.category.findMany({
        include: {
            _count: {
                select: {
                    meals: true,
                },
            },
        },
    });

    return result.map((category) => ({
        ...category,
        mealsCount: category._count.meals,
        meals: category._count.meals,
    }));
}

export const CategoryService = {
    createCategory,
    getCategories,
    getAllCategoriesForSlider
}