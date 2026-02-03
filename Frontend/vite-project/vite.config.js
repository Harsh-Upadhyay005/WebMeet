import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Enable minification for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true,
      },
    },
    // Split chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // Stream SDK chunk
          stream: ['stream-chat', 'stream-chat-react', '@stream-io/video-react-sdk'],
          // UI libraries
          ui: ['lucide-react', 'react-hot-toast'],
          // Data fetching
          query: ['@tanstack/react-query', 'axios'],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
  },
})
