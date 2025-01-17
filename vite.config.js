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
        short_name: "Aucto Games",
        description: "Cricket Auction Game",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "/vite.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/vite.png",
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
            urlPattern:
              /^https:\/\/server\.rishabh17704\.workers\.dev\/api\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "main-api-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60,
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
            urlPattern:
              /^https:\/\/server\.rishabh17704\.workers\.dev\/api\/admin\/.*/i,
            handler: "NetworkOnly",
            options: {
              cacheName: "admin-api-cache",
            },
          },
          {
            urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "external-assets",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 7 * 24 * 60 * 60,
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
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          vendor: ["axios"],
        },
      },
    },
  },
  server: {
    port: 5174,
  },
});
