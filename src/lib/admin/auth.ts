export const ADMIN_PASSWORD_ENV = "CARDPULSE_ADMIN_PASSWORD";
export const ADMIN_SESSION_COOKIE = "cardpulse_admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export const getAdminPassword = () => {
  const value = process.env[ADMIN_PASSWORD_ENV];
  if (!value) {
    throw new Error(`Missing environment variable: ${ADMIN_PASSWORD_ENV}`);
  }
  return value;
};

import { createHmac } from "crypto";

export const getAdminSessionToken = () =>
  createHmac("sha256", getAdminPassword())
    .update("cardpulse-admin")
    .digest("hex");

export const isAdminSessionValid = (token: string | undefined) =>
  Boolean(token) && token === getAdminSessionToken();

export const buildAdminSessionCookie = (token: string) => ({
  name: ADMIN_SESSION_COOKIE,
  value: token,
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  path: "/"
});
