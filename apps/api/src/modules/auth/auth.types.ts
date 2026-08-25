export type AuthUserRole = "OWNER" | "ADMIN" | "MEMBER";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  merchantName: string;
  razorpayAccountId?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  merchantId: string;
  email: string;
  name: string;
  role: AuthUserRole;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface RegisterResponse {
  user: AuthUser;
}

export interface RefreshTokenInput {
  refreshToken: string;
}

export interface LogoutInput {
  refreshToken: string;
}