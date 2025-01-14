import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "masked-icon.svg",
      ],
      manifest: {
        name: "Aucto Games",
        short_name: "Aucto",
        description: "Cricket Auction Game",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "/vite-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/vite-512x512.png",
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
            // Cache main API endpoint
            urlPattern:
              /^https:\/\/server\.rishabh17704\.workers\.dev\/api\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "main-api-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60, // 1 day
              },
              networkTimeoutSeconds: 10,
              cacheableResponse: {
                statuses: [0, 200],
              },
              matchOptions: {
                ignoreSearch: false,
              },
            },
          },
          {
            // Admin API routes (no cache, adjusted to remove networkTimeoutSeconds)
            urlPattern:
              /^https:\/\/server\.rishabh17704\.workers\.dev\/api\/admin\/.*/i,
            handler: "NetworkOnly",
            options: {
              cacheName: "admin-api-cache",
            },
          },
          {
            // Cache external image assets
            urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif)$/i,
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
  build: {
    chunkSizeWarningLimit: 1000, // Increase limit to suppress warnings
    rollupOptions: {
      output: {
        manualChunks: {
          // Code splitting for large dependencies
          react: ["react", "react-dom"],
          vendor: ["axios"], // Add more as needed
        },
      },
    },
  },
  server: {
    port: 5174,
  },
});
