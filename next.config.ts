import type { NextConfig } from "next";

const isStaticExport = process.env.NOL_STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  ...(isStaticExport
    ? {
        output: "export",
        trailingSlash: true,
        images: {
          unoptimized: true,
        },
      }
    : {
        async headers() {
          return [
            {
              source: "/(.*)",
              headers: [
                { key: "X-Content-Type-Options", value: "nosniff" },
                { key: "X-Frame-Options", value: "DENY" },
                {
                  key: "Referrer-Policy",
                  value: "strict-origin-when-cross-origin",
                },
                {
                  key: "Permissions-Policy",
                  value: "camera=(), microphone=(), geolocation=()",
                },
                { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
              ],
            },
          ];
        },
      }),
};

export default nextConfig;
