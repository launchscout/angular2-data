import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript';
import multiEntry from 'rollup-plugin-multi-entry';

export default {
  entry: 'test/**/*_test.ts',
  plugins: [typescript(), babel(), multiEntry()],
  format: 'cjs',
  intro: 'require("source-map-support").install();',
  dest: 'build/test-bundle.js',
  sourceMap: true
};
