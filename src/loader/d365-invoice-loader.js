import { Container } from 'aurelia-dependency-injection';
import { Config } from "aurelia-api";

const resource = 'D365/pending-invoice-grouped';

module.exports = function (keyword, filter) {

    var config = Container.instance.get(Config);
    var endpoint = config.getEndpoint("purchasing-azure");

    return endpoint.find(resource, { keyword: keyword, size: 10 })
        .then(results => {
            return results.data.map(invoice => {
                invoice.purchaseOrders = invoice.Items.map(item => item.PONo.trim()).join(", ");
                return invoice;
            })
        });
}