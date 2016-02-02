export class DefaultSerializer {
  serialize(instance) {
    return JSON.stringify({data: instance});
  }

  deserializeOne(response, domainClass) {
    return new domainClass(response.json().data);
  }

  deserializeMany(response, domainClass) {
    return response.json().data.map((props) => new domainClass(props));
  }
}
