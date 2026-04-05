import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createCuisine = async (payload: Prisma.CuisineCreateInput) => {
    console.log(payload)
    const result = await prisma.cuisine.create({
        data: payload
    })
    return result;
}

export const CuisineService = {
    createCuisine
}