import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_SESSION_COOKIE, isAdminSessionValid } from "./auth";

export const requireAdminSession = () => {
  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  if (!isAdminSessionValid(token)) {
    redirect("/admin");
  }
};
