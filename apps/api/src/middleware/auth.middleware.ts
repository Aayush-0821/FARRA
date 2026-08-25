import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { AppError } from "../errors/app.errors.js";
import { verifyAccessToken } from "../utils/jwt.js";

export interface AuthenticatedUser {
  id: string;
  merchantId: string;
  email: string;
  name: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
}

export interface AuthenticatedRequest
  extends Request {
  user: AuthenticatedUser;
}

export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authorization =
      req.headers.authorization;

    if (!authorization) {
      throw new AppError(
        "Access token is required",
        401,
      );
    }

    const [scheme, token] =
      authorization.split(" ");

    if (
      scheme !== "Bearer" ||
      !token
    ) {
      throw new AppError(
        "Invalid authorization header",
        401,
      );
    }

    let payload;

    try {
      payload = await verifyAccessToken(token);
    } catch {
      throw new AppError(
        "Invalid or expired access token",
        401,
      );
    }

    if (
      typeof payload.sub !== "string" ||
      typeof payload.merchantId !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string" ||
      !isValidRole(payload.role)
    ) {
      throw new AppError(
        "Invalid access token payload",
        401,
      );
    }

    req.user = {
      id: payload.sub,
      merchantId: payload.merchantId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };

    next();
  } catch (error) {
    next(error);
  }
}

function isValidRole(
  role: unknown,
): role is AuthenticatedUser["role"] {
  return (
    role === "OWNER" ||
    role === "ADMIN" ||
    role === "MEMBER"
  );
}