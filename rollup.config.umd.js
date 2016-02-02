import config from './rollup.config';
import typescript from 'rollup-plugin-typescript';

config.format = 'umd';
config.dest = 'dist/angular2-data.umd.js';
config.moduleName = 'angular2data';

export default config;
