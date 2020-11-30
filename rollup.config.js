import {terser} from 'rollup-plugin-terser'
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
};
