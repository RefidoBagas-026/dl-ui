import { RestService } from '../../../utils/rest-service';


const serviceUri = 'master/products';


class Service extends RestService {

     constructor(http, aggregator, config, endpoint) {
        super(http, aggregator, config, "core");
    }

    getProduct(info) {
    var endpoint = `${serviceUri}`;
    return super.list(endpoint, info);
    }

    getProductsByIds(ids) {
        return Promise.all(
            ids.map(id => super.get(`${serviceUri}/${id}`).catch(() => null))
        ).then(results => ({ data: results.filter(p => p !== null) }));
    }

};

export { Service }
