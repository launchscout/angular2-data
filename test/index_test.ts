import { Store, StoreConfig } from '../lib/index';
import { strictEqual } from 'assert';
import "reflect-metadata";
import {provide} from 'angular2/core';
import {
  describe,
  expect,
  beforeEach,
  it,
  inject,
  injectAsync,
  beforeEachProviders
} from 'angular2/testing';
import { Model } from "../lib/model";
import { XHRBackend, HTTP_PROVIDERS, Response, ResponseOptions } from "angular2/http";
import { MockBackend } from "angular2/http/testing";

@Model({path: "/my_models"})
class MyModel {
  constructor(public attributes:Object) {}
}

@StoreConfig({
  baseURL: "http://localhost:4000/api"
})
class TestStore extends Store {
  constructor(public http:Http) {}
}

describe('Store', () => {
  beforeEachProviders(() => {
    return [
      HTTP_PROVIDERS,
      provide(XHRBackend, {useClass: MockBackend}),
      TestStore
    ];
  });

  it('can be constructed', () => {
    let store = new Store();
    assert(store.constructor == Store);
  });

  it("gets models", inject([XHRBackend, TestStore], (mockBackend, store) => {
    expect(mockBackend).toBeDefined();
    mockBackend.connections.subscribe( (connection) => {
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify({data: [{id: 1, name: "foo"}]})
      })));
    });
    expect(store).toBeDefined();
    store.query(MyModel).subscribe( (myModels) => {
      expect(myModels.length).toEqual(1);
      expect(myModels[0].attributes.name).toEqual("foo");
    });
  }));
});
