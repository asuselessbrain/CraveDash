import { AuthRoutes } from "../../modules/auth/auth.route";
import { CuisineRoutes } from "../../modules/cuisine/cuisine.route";
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
  }
];

routes.forEach((route) => router.use(route.path, route.route));

export default router