import { Container } from "aurelia-dependency-injection";
import { Config } from "aurelia-api";

const resource = "garment/waste/expenditure";

module.exports = function(keyword, filter) {
  filter = filter || {};
  filter.IsUsed = false;

  const config = Container.instance.get(Config);
  const endpoint = config.getEndpoint("inventory-azure");

  return endpoint.find(resource, { keyword: keyword, filter: JSON.stringify(filter) })
    .then(result => {
      const data = (result && result.data) ? result.data : [];
      return data.filter(d => d && d.IsUsed === false);
    })
    .catch(() => []);
};

