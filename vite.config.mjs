import { defineConfig, loadEnv, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const RN_EXTENSIONS = [
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
];

function requireImagesPlugin() {
  return {
    name: 'require-images',
    transform(code, id) {
      if (id.includes('node_modules')) return null;
      if (!/\.[jt]sx?$/.test(id)) return null;
      if (!code.includes('require(')) return null;

      const imports = [];
      let n = 0;
      const next = code.replace(
        /require\(\s*(['"])([^'"]+\.(?:png|jpe?g|gif|webp|svg|bmp))\1\s*\)/g,
        (_, quote, spec) => {
          const ident = `__requiredAsset${n++}`;
          imports.push(`import ${ident} from ${quote}${spec}${quote};`);
          return ident;
        }
      );
      if (!imports.length) return null;
      return { code: `${imports.join('\n')}\n${next}`, map: null };
    },
  };
}

// Expo distributes JSX in .js files. Transform it before Rollup parses imports,
// including production builds (optimizeDeps only covers the dev server).
function expoJsxPlugin() {
  return {
    name: 'expo-jsx',
    enforce: 'pre',
    transform(code, id) {
      if (!/node_modules\/(?:expo-[^/]+|@expo\/[^/]+)\/.*\.js$/.test(id)) return null;
      return transformWithEsbuild(code, id, { loader: 'jsx', jsx: 'automatic' });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const publicEnv = Object.fromEntries(
    Object.entries(env).filter(
      ([key]) => key.startsWith('EXPO_PUBLIC_') || key.startsWith('VITE_')
    )
  );
  const isDev = mode !== 'production';

  return {
    plugins: [expoJsxPlugin(), react(), requireImagesPlugin()],
    envPrefix: ['VITE_', 'EXPO_PUBLIC_'],
    optimizeDeps: {
      esbuildOptions: {
        loader: { '.js': 'jsx' },
        resolveExtensions: RN_EXTENSIONS,
        define: {
          __DEV__: JSON.stringify(isDev),
          global: 'globalThis',
        },
      },
    },
    resolve: {
      extensions: RN_EXTENSIONS,
      alias: [
        {
          find: 'react-native/Libraries/Utilities/codegenNativeComponent',
          replacement: path.resolve(__dirname, 'src/shims/codegenNativeComponent.jsx'),
        },
        {
          find: 'react-native/Libraries/Image/resolveAssetSource',
          replacement: path.resolve(__dirname, 'src/shims/resolveAssetSource.jsx'),
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
        {
          find: 'react-native',
          replacement: path.resolve(__dirname, 'src/shims/react-native-web-wrapper.jsx'),
        },
      ],
    },
    define: {
      'process.env': JSON.stringify({ NODE_ENV: mode, ...publicEnv }),
      global: 'globalThis',
      __DEV__: JSON.stringify(isDev),
    },
  };
});
