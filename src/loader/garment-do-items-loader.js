import { Container } from 'aurelia-dependency-injection';
import { Config } from "aurelia-api";

const resource = 'garment-do-items/by-po-expendProcess';

module.exports = function (keyword, filter) {
    console.log(resource);
    var config = Container.instance.get(Config);
    var endpoint = config.getEndpoint("purchasing-azure");
    keyword = keyword ? keyword.trim() : "";
    return endpoint.find(resource, {
        keyword: keyword === "" ? null : keyword, 
        filter: JSON.stringify(filter),
        size: 10
    })
    .then(results => {
        return results.data;
    });
}
