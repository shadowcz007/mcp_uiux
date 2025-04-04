import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
 

export default [
  // CommonJS
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'cjs'
    },
    external: ['react', 'react-dom'],
    plugins: [typescript()]
  },
  // ES Module
  {
    input: 'src/index.ts', 
    output: {
      file: 'dist/index.esm.js',
      format: 'es'
    },
    external: ['react', 'react-dom'],
    plugins: [typescript()]
  },
  // UMD
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/mcp-uiux.umd.js',
      format: 'umd',
      name: 'MCPUiux',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM'
      }
    },
    external: ['react', 'react-dom'],
    plugins: [
      typescript(),
      resolve(),
      commonjs(),
      terser()
    ]
  }
];