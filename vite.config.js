import { defineConfig, loadEnv } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import solidSvg from "vite-plugin-solid-svg";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [
            solidPlugin(),
            solidSvg(),
            VitePWA({
                registerType: 'autoUpdate',
                workbox: {
                    globPatterns: ['**/*.{js,css,html}', 'images/**/*.{svg,png,ico}',
                        'data/**/*.{png}'
                    ],
                    cleanupOutdatedCaches: true,
                    maximumFileSizeToCacheInBytes: (12 /*MiB*/ ) * 1000000
                },
                devOptions: {
                    enabled: true
                },
                manifest: {
                    name: env.VITE_NAME,
                    short_name: env.VITE_NAME,
                    description: env.VITE_DESCRIPTION,
                    theme_color: '#ffffff',
                    icons: [{
                            src: '/images/icon-192.png',
                            sizes: '192x192',
                            type: 'image/png'
                        },
                        {
                            src: '/images/icon-512.png',
                            sizes: '512x512',
                            type: 'image/png'
                        }
                    ]
                }
            })
        ],
        server: {
            port: 80
        },
        build: {
            minify: true,
            target: 'esnext'
        }
    };
});