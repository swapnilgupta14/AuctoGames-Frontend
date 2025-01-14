import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "Aucto Games",
        short_name: "Aucto",
        description: "Cricket Auction Game",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "/vite.svg", // Make sure to update these with actual icon paths
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/vite.svg", // Make sure to update these with actual icon paths
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            // Main API endpoint caching
            urlPattern:
              /^https:\/\/server\.rishabh17704\.workers\.dev\/api\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "main-api-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              networkTimeoutSeconds: 10,
              cacheableResponse: {
                statuses: [0, 200], // Cache successful responses and CORS responses
              },
              matchOptions: {
                ignoreSearch: false, // Consider query parameters in the cache key
              },
            },
          },
          {
            // Admin API endpoint caching (might want different caching strategy)
            urlPattern:
              /^https:\/\/server\.rishabh17704\.workers\.dev\/api\/admin\/.*/i,
            handler: "NetworkOnly", // Admin routes typically shouldn't be cached
            options: {
              cacheName: "admin-api-cache",
              networkTimeoutSeconds: 10,
            },
          },
          {
            // Cache static assets from CDNs or external sources
            urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "external-assets",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  server: {
    port: 5174,
  },
});
