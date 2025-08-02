import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'express-dev-server',
      configureServer(server) {
        server.middlewares.use('/api', async (req, res, next) => {
          try {
            const { createServer } = await import('./server/index');
            const expressApp = createServer();
            expressApp(req, res, next);
          } catch (error) {
            console.error('Error loading express server:', error);
            next(error);
          }
        });
      },
    },
  ],
  server: {
    port: 8080,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
});
