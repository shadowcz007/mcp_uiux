import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: true
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'MCPUIUX',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM'
      },
      exports: 'named',
      sourcemap: true
    },
    {
      file: 'dist/index.umd.min.js',
      format: 'umd',
      name: 'MCPUIUX',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM'
      },
      exports: 'named',
      plugins: [terser()],
      sourcemap: true
    }
  ],
  external: [...Object.keys(pkg.peerDependencies || {})],
  plugins: [
    resolve({
      browser: true, // 因为这是要在浏览器中运行的
      preferBuiltins: false
    }),
    commonjs({
      include: /node_modules/
    }),
    typescript({
      typescript: require('typescript'),
      clean: true,
      tsconfig: 'tsconfig.json',
      tsconfigOverride: {
        compilerOptions: {
          module: 'esnext',
          jsx: 'react'
        }
      }
    }),
    postcss({
      extensions: ['.css'],
      minimize: true,
      inject: {
        insertAt: 'top'
      }
    })
  ]
}
