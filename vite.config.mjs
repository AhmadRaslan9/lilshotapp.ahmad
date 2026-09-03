import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  resolve: {
    extensions: [
      '.web.jsx',
      '.web.js',
      '.web.ts',
      '.web.tsx',
      '.mjs',
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      '.json',
    ],
    alias: [
      {
        find: 'react-native/Libraries/Utilities/codegenNativeComponent',
        replacement: path.resolve(
          __dirname,
          'src/shims/codegenNativeComponent.jsx'
        ),
      },
      {
        find: 'react-native/Libraries/Image/resolveAssetSource',
        replacement: path.resolve(
          __dirname,
          'src/shims/resolveAssetSource.jsx'
        ),
      },
      {
        find: 'react-native/Libraries/Renderer/shims/ReactFabric',
        replacement: path.resolve(__dirname, 'src/shims/emptyModule.jsx'),
      },
      {
        find: 'react-native/Libraries/Renderer/shims/ReactNative',
        replacement: path.resolve(__dirname, 'src/shims/emptyModule.jsx'),
      },
      {
        find: 'react-native/Libraries/ReactNative/ReactFabricPublicInstance/ReactFabricPublicInstance',
        replacement: path.resolve(__dirname, 'src/shims/emptyModule.jsx'),
      },
      {
        find: '@react-native/assets-registry/registry',
        replacement: path.resolve(__dirname, 'src/shims/assetsRegistry.jsx'),
      },
      { find: 'react-native', replacement: path.resolve(__dirname, 'src/shims/react-native-web-wrapper.jsx') },
    ],
  },
  define: {
    'process.env': {},
    global: 'window',
    __DEV__: JSON.stringify(true),
  },
});