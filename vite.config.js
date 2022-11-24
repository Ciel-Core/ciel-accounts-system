import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import solidSvg from "vite-plugin-solid-svg";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        solidPlugin(),
        solidSvg(),
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true
            },
            manifest: {
                name: 'MyPWA',
                short_name: 'aPWA',
                description: 'My PWA for you!',
                // theme_color: '#c90c3b',
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
});