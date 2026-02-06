import { AuthRoutes } from "../../modules/auth/auth.route";
import { UserRoutes } from "../../modules/user/user.route";
import express from "express";

const router = express.Router();

const routes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes
  }
];

routes.forEach((route) => router.use(route.path, route.route));

export default router