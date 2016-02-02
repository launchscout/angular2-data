import config from './rollup.config';
import typescript from 'rollup-plugin-typescript';

config.format = 'umd';
config.dest = 'dist/rollup-starter-project.umd.js';
config.moduleName = 'rollupStarterProject';

export default config;
