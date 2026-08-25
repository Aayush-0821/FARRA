import { Router } from "express";

import { prisma } from "../../lib/prisma.js";

import { AuthController } from "./auth.controller.js";
import { AuthRepository } from "./auth.repository.js";
import { AuthService } from "./auth.service.js";

const authRouter = Router();

const authRepository = new AuthRepository(prisma);
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

authRouter.post(
  "/register",
  authController.register.bind(authController),
);

authRouter.post(
  "/login",
  authController.login.bind(authController),
);

authRouter.post(
  "/verify-email",
  authController.verifyEmail.bind(authController),
);

authRouter.post(
  "/resend-verification",
  authController.resendVerificationEmail.bind(authController),
);

authRouter.post(
  "/refresh",
  authController.refresh.bind(authController),
);

authRouter.post(
  "/logout",
  authController.logout.bind(authController),
);

authRouter.post(
  "/forgot-password",
  authController.forgotPassword.bind(authController),
);

authRouter.post(
  "/reset-password",
  authController.resetPassword.bind(authController),
);

export default authRouter;