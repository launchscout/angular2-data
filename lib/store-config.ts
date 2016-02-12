
export class StoreConfigMetadata {
  constructor(config) {
    this.config = config;
  }
}

export var StoreConfig = function(config) {
  return (store) => {
    store.config = config;
    console.log(store);
    return store;
  }
}

//makeDecorator(StoreConfigMetadata);
