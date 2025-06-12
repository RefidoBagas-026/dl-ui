import { inject, Lazy } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { RestService } from '../../../../utils/rest-service';

const serviceUri = 'pr-master-usage-monitorings';

export class Service extends RestService {

    constructor(http, aggregator, config, endpoint) {
        super(http, aggregator, config, "purchasing-azure");
    }

    search(info) {
        let endpoint = `${serviceUri}`;
        return super.list(endpoint, info);
    }

    getXls(info) {
        var endpoint = `${serviceUri}/download?buyer=${info.buyer}&article=${info.article}&category=${info.category}`;
        return super.getXls(endpoint);
    }
}
