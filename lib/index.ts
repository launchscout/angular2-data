import { Injectable, Inject } from "angular2/core";
import {Http, Headers} from 'angular2/http';
import {reflector} from 'angular2/src/core/reflection/reflection';
import "rxjs/Rx";
import { StoreConfig } from "./store-config";
export { StoreConfig };
export { Model } from "./model";
import { DefaultSerializer } from "./default-serializer";
export { DefaultSerializer };
import "reflect-metadata";

export class Store {
  constructor(@Inject(Http) public http:Http) {}

  get config() {
    return this.constructor.config;
  }

  get serializer() {
    if (!this._serializer) {
      this._serializer = new DefaultSerializer();
    }
    return this._serializer;
  }

  getModelMetadata(domainClass) {
    // we're assuming model annotation is always first
    return reflector.annotations(domainClass)[0].options;
  }

  buildUrl(domainClass) {
    let modelMetadata = this.getModelMetadata(domainClass);
    return `${this.config.baseURL}${modelMetadata.path}`;
  }

  query(domainClass) {
    return this.http.get(this.buildUrl(domainClass))
      .map(res => this.serializer.deserializeMany(res, domainClass));
  }

  find(domainClass, id) {
    return this.http.get(`${this.buildUrl(domainClass)}/${id}`)
      .map(res => this.serializer.deserializeOne(res, domainClass));
  }

  create(instance) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this.http.post(this.buildUrl(instance.constructor),this.serializer.serialize(instance), {headers: headers})
      .map(res => this.serializer.deserializeOne(res, instance.constructor));
  }

  update(instance) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this.http.put(`${this.buildUrl(instance.constructor)}/${instance.id}`,this.serializer.serialize(instance), {headers: headers})
      .map(res => this.serializer.deserializeOne(res, instance.constructor));
  }

  delete(instance) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this.http.delete(`${this.buildUrl(instance.constructor)}/${instance.id}`, {headers: headers});
  }

}
