import {makeDecorator} from "angular2/src/core/util/decorators";

export class StoreConfigMetadata {
  constructor(config) {
    this.config = config;
  }
}

export var StoreConfig = makeDecorator(StoreConfigMetadata);
