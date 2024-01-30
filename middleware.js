export { default } from "next-auth/middleware"

export const config = { matcher: ["/personal", "/personal/:path*", "/addwallet", "/addedwallet"] }