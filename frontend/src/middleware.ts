export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/reserve",
    "/profile",
    "/manage",
    "/balance",
    "/dashboard",
    "/mystore",
    "/add",
  ],
};
