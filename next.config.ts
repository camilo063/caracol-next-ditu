import type { NextConfig } from "next";

import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // dominios CDN/storage se añaden aquí cuando se configure Media.
    ],
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
