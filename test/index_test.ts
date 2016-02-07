import { Store, StoreConfig } from '../lib/index';
import "reflect-metadata";
import {provide} from 'angular2/core';
import _ from "underscore";
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
import { XHRBackend, HTTP_PROVIDERS, Response, ResponseOptions, RequestMethod } from "angular2/http";
import { MockBackend } from "angular2/http/testing";

@Model({path: "/my_models"})
class MyModel {
  constructor(attributes) {
    _.extend(this, attributes);
  }
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
      expect(connection.request.url).toMatch(/my_models/);
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify({data: [{id: 1, name: "foo"}]})
      })));
    });
    expect(store).toBeDefined();
    store.query(MyModel).subscribe( (myModels) => {
      expect(myModels.length).toEqual(1);
      expect(myModels[0].name).toEqual("foo");
    });
  }));

  it("creates models", inject([XHRBackend, TestStore], (mockBackend, store) => {
    mockBackend.connections.subscribe( (connection) => {
      expect(connection.request.url).toMatch(/my_models/);
      expect(connection.request.headers.get("Content-Type")).toEqual("application/json");
      expect(RequestMethod[connection.request.method]).toEqual("Post");
      expect(JSON.parse(connection.request.text()).data.name).toEqual("foo");
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify({data: {id: 1, name: "foo"}})
      })));
    });
    let myModel = new MyModel({name: "foo"});
    store.create(myModel).subscribe( (myModel) => {
      expect(myModel.id).toEqual(1);
      expect(myModel.name).toEqual("foo");
    });
  }));

  it("updates models", inject([XHRBackend, TestStore], (mockBackend, store) => {
    mockBackend.connections.subscribe( (connection) => {
      expect(connection.request.url).toMatch(/my_models\/1/);
      expect(connection.request.headers.get("Content-Type")).toEqual("application/json");
      expect(RequestMethod[connection.request.method]).toEqual("Put");
      expect(JSON.parse(connection.request.text()).data.name).toEqual("foo");
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify({data: {id: 1, name: "foo"}})
      })));
    });
    let myModel = new MyModel({id: 1, name: "foo"});
    store.update(myModel).subscribe( (myModel) => {
      expect(myModel.name).toEqual("foo");
    });
  }));

  it("deletes models", inject([XHRBackend, TestStore], (mockBackend, store) => {
    mockBackend.connections.subscribe( (connection) => {
      expect(connection.request.url).toMatch(/my_models\/1/);
      expect(connection.request.headers.get("Content-Type")).toEqual("application/json");
      expect(RequestMethod[connection.request.method]).toEqual("Delete");
      connection.mockRespond(new Response(new ResponseOptions({
        status: 204 // No content
      })));
    });
    let myModel = new MyModel({id: 1, name: "foo"});
    store.delete(myModel).subscribe( (response) => {
      // dunno yet
    });
  }));

});
