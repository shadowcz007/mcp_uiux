import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default [{
        input: 'src/index.ts',
        output: [{
                file: pkg.main,
                format: 'cjs',
                exports: 'named',
                sourcemap: false
            },
            {
                file: pkg.module,
                format: 'es',
                exports: 'named',
                sourcemap: false
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
                sourcemap: false
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
                sourcemap: false
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
    },
    // 新增的配置，用于单独打包 mcpclient.ts
    {
        input: 'src/MCPClient.ts', // 假设 mcpclient.ts 在 src 目录下
        output: [{
            file: 'dist/MCPClient.js', // 输出文件路径
            format: 'es', // 使用 ES 模块格式，你可以根据需要改为 'cjs' 或 'umd'
            exports: 'named',
            sourcemap: false
        }],
        external: [...Object.keys(pkg.peerDependencies || {})], // 与主配置保持一致
        plugins: [
            resolve({
                browser: true,
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
                        // "lib": ["dom"],
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
]