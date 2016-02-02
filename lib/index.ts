import { Injectable, Inject } from "angular2/core";
import {Http, Headers} from 'angular2/http';
import {reflector} from 'angular2/src/core/reflection/reflection';
import "rxjs/Rx";
export { StoreConfig } from "./store-config";
export { Model } from "./model";

export class Store {
  constructor(@Inject(Http) public http:Http) {}

  get config() {
    return reflector.annotations(this.constructor)[0].config;
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
      .map(res => res.json().data)
      .map(propertiesArray => propertiesArray.map((props) => new domainClass(props)));
  }

  getPayloadKey(instance) {
    return this.getModelMetadata(instance.constructor).payloadKey || "data";
  }

  create(instance) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    let payload = {};
    payload[this.getPayloadKey(instance)] = instance;
    return this.http.post(this.buildUrl(instance.constructor),JSON.stringify(payload), {headers: headers})
      .map(res => res.json().data)
      .map((props) => new instance.constructor(props));
  }

}
