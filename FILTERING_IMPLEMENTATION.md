# Backend Filtering Implementation

## Overview
A comprehensive filtering system has been implemented across the CraveDash backend to enable advanced data filtering capabilities across multiple modules and services.

## What Was Implemented

### 1. **Filtering Utility Function** (`src/utils/filtering.ts`)
Core filtering function that processes filter data with the following features:
- **Comma-separated values**: Automatically splits comma-separated strings into arrays
  - Example: `"PENDING,CONFIRMED"` becomes `["PENDING", "CONFIRMED"]`
- **Boolean conversion**: Converts string boolean values to actual booleans
  - `"true"` → `true`, `"false"` → `false`
- **Array handling**: Uses `in` for array values, `equals` for single values
- **Nested filtering**: Supports dot notation for nested fields
  - Example: `"items.some.meal.providerEmail"` for nested relations
- **AND logic**: Combines multiple filter conditions with AND operator

### 2. **Order Service** (`src/modules/order/order.service.ts`)
Enhanced with filtering on three key methods:

#### `getMyOrders()`
Filter parameters:
- `orderStatus` - Filter by order status (e.g., PENDING, CONFIRMED, SHIPPED)
- `paymentStatus` - Filter by payment status
- `paymentMethod` - Filter by payment method

#### `getProvidersOrders()`
Filter parameters:
- `orderStatus` - Filter by order status
- `paymentStatus` - Filter by payment status
- `paymentMethod` - Filter by payment method

#### `getAdminOrders()`
Filter parameters:
- `orderStatus` - Filter by order status
- `paymentStatus` - Filter by payment status
- `paymentMethod` - Filter by payment method
- `userEmail` - Filter orders by customer email
- `providerEmail` - Filter orders by provider email (via nested relation)

### 3. **Meal Service** (`src/modules/meal/meal.service.ts`)
Enhanced with filtering on two key methods:

#### `getProvidersMeals()`
Filter parameters:
- `availabilityStatus` - Filter by availability status
- `mealType` - Filter by meal type
- `dietaryTag` - Filter by dietary tag
- `spiceLevel` - Filter by spice level
- `categoryId` - Filter by category ID
- `cuisineId` - Filter by cuisine ID (nested relation)

#### `getMeals()`
Filter parameters (all from getProvidersMeals plus):
- `providerEmail` - Filter meals by provider email

### 4. **Category Service** (`src/modules/category/category.service.ts`)
Enhanced `getCategories()` with filter parameters:
- `status` - Filter by status (ACTIVE, INACTIVE, etc.)
- `cuisineId` - Filter by cuisine ID

### 5. **Cuisine Service** (`src/modules/cuisine/cuisine.service.ts`)
Enhanced `getCuisines()` with filter parameters:
- `status` - Filter by status (ACTIVE, INACTIVE, etc.)

### 6. **User Service** (`src/modules/user/user.service.ts`)
Enhanced `getAdminUsers()` with filter parameters:
- `role` - Filter by user role (ADMIN, CUSTOMER, PROVIDER)
- `status` - Filter by user status (ACTIVE, INACTIVE, BLOCKED)
- Supports comma-separated values for multiple filters

## Usage Examples

### Basic Filtering
```
GET /api/orders?orderStatus=PENDING
```

### Multiple Values (Comma-separated)
```
GET /api/orders?orderStatus=PENDING,CONFIRMED,SHIPPED
```

### Multiple Filters
```
GET /api/meals?availabilityStatus=AVAILABLE&mealType=Breakfast,Lunch&categoryId=123
```

### Filtering with Search and Pagination
```
GET /api/users?searchTerm=john&role=CUSTOMER&status=ACTIVE&skip=0&take=10&sortBy=email&sortOrder=asc
```

### Nested Field Filtering (Admin Orders)
```
GET /api/admin/orders?providerEmail=provider@example.com
```

## Technical Details

### Filter Data Processing Flow
1. Extract filter parameters from query string
2. Build `filterData` object with non-null filter values
3. Pass to `filtering()` function which:
   - Splits comma-separated strings into arrays
   - Converts boolean strings to actual booleans
   - Creates appropriate Prisma WhereInput conditions
   - Combines conditions with AND logic
4. Merges with existing search/pagination conditions
5. Apply to Prisma findMany queries

### Type Safety
- All filter functions are fully typed with TypeScript
- Prisma's type system ensures type-safe query building
- Supports union types for multiple model filtering

### Performance Considerations
- Filtering happens at the database level (Prisma)
- Uses Prisma's efficient IN operator for array values
- Maintains existing index usage patterns
- No additional database queries required

## Migration Notes
- **Breaking Changes**: None. Existing queries continue to work without modification
- **Backward Compatible**: All existing API calls work as before
- **Optional Parameters**: All filter parameters are optional
- **Default Behavior**: If no filters provided, returns all records matching search/pagination

## Testing Recommendations
1. Test single value filtering: `?orderStatus=PENDING`
2. Test multiple values: `?orderStatus=PENDING,CONFIRMED`
3. Test mixed filters: `?orderStatus=PENDING&paymentMethod=CARD`
4. Test with search and pagination
5. Test nested field filtering: `?providerEmail=provider@example.com`
6. Test with boolean conversions: `?activeStatus=true`

## Future Enhancement Opportunities
- Implement range filtering (e.g., price between $10-$50)
- Add NOT/NOR operators for exclusion filters
- Implement date range filtering
- Add filter validation schema
- Create filter preset management
