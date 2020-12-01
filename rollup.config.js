import {terser} from 'rollup-plugin-terser'
import {builtinModules} from 'module';
import {dependencies} from './package.json';
export default {
  input: 'Source/index.js',
  output: [{
    file: 'Build/index.cjs',
    format: 'cjs',
    plugins: []
  },
  {
    file: 'Build/index.js',
    format: 'es',
    plugins: []
  }],
  plugins: [terser()],
  external: [...builtinModules, ...Object.keys(dependencies)]
};
