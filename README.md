# angular2-data

This is project is a data layer for angular2. It's still early times, but comes with an [example project](https://github.com/gaslight/angular2-data-example) based on the Heroes tutorial from the angular2 documentation.

## Installation

```
npm install angular2-data
```

## Usage

You'll need to create a Store which you can inject into a component or service. Use the StoreConfig to set the baseURL.

```typescript
import {Injectable} from 'angular2/core';
import {Store, StoreConfig} from "angular2-data";

@Injectable()
@StoreConfig({
  baseURL: "http://localhost:8000"
})
export class MyStore extends Store {

  constructor(public http: Http) {}

}
```

The constructor is required so that the store is injected with an Http service.

To use a store, you'll need a model:

```typescript
import {Model} from "angular2-data";
import _ from "underscore";

@Model({
  path: "/things",
  payloadKey: "thing"
})
class Thing {
  constructor(props) {
    // yeah, yeah, kinda gross I know.
    _.extend(this, props);
  }
}

export default Thing;
```

You can then retrieve and create models.

```typescript
this.store.query(Thing).subscribe( (things) => {
  console.log(things);
  this.things = things;
});

this.store.find(Thing, 1).subscribe( (thing) => {
  console.log(thing);
  this.thing = thing;
});

this.store.create(new Thing({name: "Bob"})).subscribe((thing) => {
  this.createdThing = thing;
});
```

## TODONE

* Tests (thank to angular2-testing, jasmine, and rollup!)
* update

## TODO

* Delete
* Relationships
* jsonapi support
* Identity cache
* server sent updates
