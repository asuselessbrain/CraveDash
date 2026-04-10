import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { pagination } from "../../utils/pagination";
import { searching } from "../../utils/searching";

const createCuisine = async (payload: Prisma.CuisineCreateInput) => {
    const result = await prisma.cuisine.create({
        data: payload
    })
    return result;
}

const getCuisines = async (query: Record<string, unknown>) => {

    const { searchTerm, skip, take, sortBy, sortOrder } = query;
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

    const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } =
        pagination(Number(skip), Number(take), safeSortBy, sortOrder === "asc" ? "asc" : "desc");

    const result = await prisma.cuisine.findMany({
        where: {
            AND: inputFilter,
        }, skip: skipValue,
        take: takeValue,
        orderBy: {
            [sortByField]: sortOrderValue
        }
    });

    const total = await prisma.cuisine.count({
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

const getAllCuisinesForCategory = async () => {
    const result = await prisma.cuisine.findMany({
    })
    return result;
}

const getAllCuisinesForFiltering = async () => {
    const result = await prisma.cuisine.findMany({
        select: {
            id: true,
            name: true,
        }
    });
    return result;
};

export const CuisineService = {
    createCuisine,
    getCuisines,
    getAllCuisinesForCategory,
    getAllCuisinesForFiltering
}