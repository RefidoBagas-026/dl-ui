import { Container } from 'aurelia-dependency-injection';
import { Config } from "aurelia-api";

const resource = 'garment/waste/receipt/search';

module.exports = function (keyword, filter, select) {

    var config = Container.instance.get(Config);
    var endpoint = config.getEndpoint("inventory-azure");

    return endpoint.post(resource, { 
        Keyword: keyword, 
        Filter: JSON.stringify(filter), 
        Select: select, 
        Order: "{}"
    })
        .then(results => {
            return results.data;
        });
}
