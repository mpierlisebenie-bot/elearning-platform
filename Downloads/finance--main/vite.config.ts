import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icons/favicon-32.png', 'icons/apple-touch-icon.png'],
        manifest: {
          id: '/',
          name: 'FinanceFlow — Gestion Financière',
          short_name: 'FinanceFlow',
          description: 'Suivez vos revenus, dépenses et dettes — synchronisé entre PC et téléphone.',
          lang: 'fr',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          orientation: 'portrait',
          background_color: '#0f172a',
          theme_color: '#0f172a',
          icons: [
            { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
            { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        workbox: {
          // Les appels API ne doivent jamais être servis par le fallback de
          // navigation SPA (sinon un GET /api/... hors-ligne renverrait le
          // HTML de l'app au lieu d'une vraie erreur réseau détectable).
          navigateFallbackDenylist: [/^\/api\//],
          runtimeCaching: [
            {
              // Les données financières restent lisibles hors-ligne (dernière
              // version connue) mais on tente toujours le réseau en premier
              // pour ne jamais afficher des données périmées quand une
              // connexion est disponible — l'écriture (POST/PUT/DELETE)
              // requiert toujours une connexion active.
              urlPattern: ({ url, sameOrigin }) => sameOrigin && url.pathname.startsWith('/api/'),
              handler: 'NetworkFirst',
              method: 'GET',
              options: {
                cacheName: 'ff-api-cache',
                networkTimeoutSeconds: 5,
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: ({ request }) =>
                ['style', 'script', 'worker', 'image', 'font'].includes(request.destination),
              handler: 'StaleWhileRevalidate',
              options: { cacheName: 'ff-assets-cache' },
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      // En dev, le frontend (Vite) et l'API (Express) tournent sur deux ports
      // séparés ; ce proxy les rend same-origin pour le navigateur (PC ou
      // téléphone), donc aucune configuration CORS n'est nécessaire.
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
  };
});
