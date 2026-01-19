import { Container } from 'aurelia-dependency-injection';
import { Config } from "aurelia-api";

const resource = 'garment-shipping/export-sales-do-upload';

module.exports = function (keyword, filter) {
  var config = Container.instance.get(Config);
  var endpoint = config.getEndpoint("packing-inventory");

  // Jika filter mengandung Id, tambahkan ke filter
  if (filter && filter.Id) {
    filter = Object.assign({}, filter, { Id: filter.Id });
  }

  return endpoint.find(resource, { keyword: keyword, filter: JSON.stringify(filter) })
    .then(results => {
      return results.data;
    });
}
