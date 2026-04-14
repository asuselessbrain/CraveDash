import { Prisma } from "../../generated/prisma/client";

type FilterableWhereInput =
  | Prisma.OrderWhereInput
  | Prisma.MealWhereInput
  | Prisma.CategoryWhereInput
  | Prisma.CuisineWhereInput
  | Prisma.UserWhereInput
  | Prisma.CartWhereInput;

export const filtering = <T extends FilterableWhereInput>(
  inputFilter: T[],
  filterData: Record<string, any>,
): T[] => {
  const filterConditions: any[] = [];

  Object.keys(filterData).forEach((key) => {
    let value = filterData[key];

    // Skip empty/null values
    if (!value) return;

    // FIX: Check if incoming value is a string and has comma, then split into array
    if (typeof value === "string" && value.includes(",")) {
      value = value.split(",").map((v: string) => v.trim()); // "FIRST,SECOND" becomes ["FIRST", "SECOND"]
    }

    if (value === "true") {
      value = true;
    } else if (value === "false") {
      value = false;
    }

    // Now logic checks if it is an array (from split above or raw input)
    const isArray = Array.isArray(value);
    const filterCondition = isArray ? { in: value } : { equals: value };

    if (key.includes(".")) {
      // Handle nested fields like "items.some.meal.providerEmail"
      const parts = key.split(".");
      let nestedFilter: any = filterCondition;
      
      // Build nested structure from right to left
      for (let i = parts.length - 1; i >= 0; i--) {
        const partKey = parts[i] as string;
        
        // Handle special Prisma operators like "some"
        if (partKey === "some" || partKey === "every" || partKey === "none") {
          nestedFilter = { [partKey]: nestedFilter };
        } else {
          nestedFilter = { [partKey]: nestedFilter };
        }
      }
      filterConditions.push(nestedFilter);
    } else {
      // Simple field filter
      filterConditions.push({ [key]: filterCondition });
    }
  });

  // Combine all filter conditions with existing inputFilter
  if (filterConditions.length > 0) {
    if (inputFilter.length > 0) {
      // If there are existing filters, combine them with AND
      inputFilter.push({ AND: filterConditions } as unknown as T);
    } else {
      // If no existing filters, just add the conditions
      filterConditions.forEach((condition) => {
        inputFilter.push(condition as T);
      });
    }
  }

  return inputFilter;
};
