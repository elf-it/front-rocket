/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        ROUTE_URI: process.env.ROUTE_URI,
        AUTH_KEY: process.env.AUTH_KEY,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        ADDRESS_BSC: process.env.ADDRESS_BSC,
        ADDRESS_USDT: process.env.ADDRESS_USDT,
        CHAIN_ID: process.env.CHAIN_ID,
    },
    reactStrictMode: true,
}

module.exports = nextConfig
