import typescript from '@rollup/plugin-typescript';
import { terser } from "rollup-plugin-terser";

export default {
  input: 'index.ts',
  output: [
    {
      file: 'index.js',
      format: 'cjs'
    },
    {
      file: 'index.esm.js',
      format: 'esm'
    }
  ],
  plugins: [
    typescript(),
    terser({
      compress: {
        defaults: true,
        pure_funcs: ['console.assert', 'console.log', 'console.debug', 'console.time', 'console.timeEnd'],
        drop_console: true,
        ecma: 5,
        keep_infinity: true,
        reduce_funcs: true,
        reduce_vars: true,
        warnings: true,
      },
      mangle: true,
    })
  ]
};