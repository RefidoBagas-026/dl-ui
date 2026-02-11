import { Container } from 'aurelia-dependency-injection';
import { Config } from "aurelia-api";

const resource = 'master/garment-currencies';

module.exports = function (keyword, filter) {

    var config = Container.instance.get(Config);
    var endpoint = config.getEndpoint("core");
    var order = {
        "Date": "desc"
    };
    return endpoint.find(resource, { keyword: keyword, filter: JSON.stringify(filter), order: JSON.stringify(order), size: 10 })
        .then(results => {
            const uniqueByCode = [];
            const seenCodes = new Set();

            for (const item of results.data) {
                if (!seenCodes.has(item.code)) {
                    seenCodes.add(item.code);
                    uniqueByCode.push(item);
                }
            }

            return uniqueByCode;
        });
}
