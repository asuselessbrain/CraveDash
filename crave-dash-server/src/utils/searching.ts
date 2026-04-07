import { Prisma } from "../../generated/prisma/client";

export const searching = (
  inputFilter: Prisma.CuisineWhereInput[],
  searchFields: string[],
  searchTerm: string,
): Prisma.CuisineWhereInput[] => {
  const orConditions: Prisma.CuisineWhereInput[] = searchFields.map((field) => {
    if (field.includes(".")) {
      const parts = field.split(".");
      let currentStructure: Record<string, unknown> = {
        contains: String(searchTerm),
        mode: "insensitive",
      };

      for (let i = parts.length - 1; i >= 0; i--) {
        const key = parts[i] as string;
        currentStructure = { [key]: currentStructure };
      }

      return currentStructure as Prisma.CuisineWhereInput;
    }

    return {
      [field]: { contains: String(searchTerm), mode: "insensitive" },
    } as Prisma.CuisineWhereInput;
  });

  return [...inputFilter, { OR: orConditions }];
};