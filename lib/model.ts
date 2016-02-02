import {makeDecorator} from "angular2/src/core/util/decorators";

export class ModelDecoratorMetadata {
  constructor(options) {
    this.options = options;
  }
}

export var Model = makeDecorator(ModelDecoratorMetadata);
