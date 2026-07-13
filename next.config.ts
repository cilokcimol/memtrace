import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@mysten-incubation/memwal", "@google/generative-ai", "@mysten/seal"],
};

export default nextConfig;
