import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'express-dev-server',
      configureServer(server) {
        let expressApp: any;

        // Initialize Express app once
        server.middlewares.use(async (req, res, next) => {
          if (!req.url?.startsWith('/api/')) {
            return next();
          }

          try {
            if (!expressApp) {
              const { createServer } = await import('./server/index.js');
              expressApp = createServer();
            }

            // Handle the API request with Express
            expressApp(req, res, (err: any) => {
              if (err) {
                console.error('Express error:', err);
                res.statusCode = 500;
                res.end('Internal Server Error');
              } else {
                next();
              }
            });
          } catch (error) {
            console.error('Error loading express server:', error);
            res.statusCode = 500;
            res.end('Server Error');
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
