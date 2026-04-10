import { AuthRoutes } from "../../modules/auth/auth.route";
import { CartRoutes } from "../../modules/cart/cart.route";
import { CuisineRoutes } from "../../modules/cuisine/cuisine.route";
import { MealRoutes } from "../../modules/meal/meal.route";
import { UserRoutes } from "../../modules/user/user.route";
import express from "express";
import { CategoryRoutes } from "../../modules/category/category.route";

const router = express.Router();

const routes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes
  },
  {
    path: "/cuisine",
    route: CuisineRoutes
  },
  {
    path: "/category",
    route: CategoryRoutes
  },
  {
    path: "/meal",
    route: MealRoutes
  },
  {
    path: "/cart",
    route: CartRoutes,
  }
];

routes.forEach((route) => router.use(route.path, route.route));

export default router