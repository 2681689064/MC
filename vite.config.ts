import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { traeBadgePlugin } from 'vite-plugin-trae-solo-badge';

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,   // 监听所有网络接口，局域网内其他设备可通过本机 IP 访问
    port: 3000,
    strictPort: true,  // 固定端口：被占用时报错而非切换，避免端口混乱
    open: true,
  },
  build: {
    sourcemap: 'hidden',
    rollupOptions: {
      output: {
        manualChunks: {
          router: ['react-router-dom'],
          ui: ['lucide-react', 'framer-motion'],
          charts: ['recharts'],
          maps: ['leaflet', 'react-leaflet'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  plugins: [
    // 使用 HTTP：localhost 被 Chrome 视为安全来源，无证书警告
    // 局域网手机端如需 HTTPS，可改用 basicSsl() 并在浏览器点击"继续前往"
    react({
      babel: {
        plugins: ['react-dev-locator'],
      },
    }),
    traeBadgePlugin({
      variant: 'dark',
      position: 'bottom-right',
      prodOnly: true,
      clickable: true,
      clickUrl: 'https://www.trae.ai/solo?showJoin=1',
      autoTheme: true,
      autoThemeTarget: '#root',
    }),
    tsconfigPaths(),
  ],
});

