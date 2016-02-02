import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript';

export default {
  entry: 'lib/index.ts',
  sourceMap: true,
  plugins: [typescript()],
  external: [
    'angular2/bootstrap',
    'angular2/http',
    'angular2/core',
    'angular2/src/core/reflection/reflection',
    'rxjs/Rx'
  ],
};
