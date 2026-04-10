import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { pagination } from "../../utils/pagination";
import { searching } from "../../utils/searching";

const createCategory = async (payload: Prisma.CategoryCreateInput) => {
    const result = await prisma.category.create({
        data: payload
    })
    return result;
}

const getCategories = async (query: Record<string, unknown>) => {

    const { searchTerm, skip, take, sortBy, sortOrder } = query;
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

    const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } =
        pagination(Number(skip), Number(take), safeSortBy, sortOrder === "asc" ? "asc" : "desc");

    const result = await prisma.category.findMany({
        where: {
            AND: inputFilter,
        }, skip: skipValue,
        take: takeValue,
        orderBy: {
            [sortByField]: sortOrderValue
        }
    });

    const total = await prisma.category.count({
        where: {
            AND: inputFilter,
        }
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

const getAllCategoriesForSlider = async () => {
    const result = await prisma.category.findMany()
    return result;
}

export const CategoryService = {
    createCategory,
    getCategories,
    getAllCategoriesForSlider
}