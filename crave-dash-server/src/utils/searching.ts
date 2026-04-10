import { Prisma } from "../../generated/prisma/client";

type SearchableWhereInput =
  | Prisma.CuisineWhereInput
  | Prisma.CategoryWhereInput
  | Prisma.MealWhereInput;

export const searching = <T extends SearchableWhereInput>(
  inputFilter: T[],
  searchFields: string[],
  searchTerm: string,
): T[] => {
  const orConditions = searchFields.map((field) => {
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

      return currentStructure as T;
    }

    return {
      [field]: { contains: String(searchTerm), mode: "insensitive" },
    } as unknown as T;
  });

  return [...inputFilter, { OR: orConditions } as unknown as T];
};