import { inject, Lazy } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { RestService } from '../../../../utils/rest-service';

const serviceUri = 'stock-report/storage-gmt';
const UnitServiceUri = 'master/units';

export class Service extends RestService {

    constructor(http, aggregator, config, endpoint) {
        super(http, aggregator, config, "dl-report");
    }

    search(info) {
        let endpoint = `${serviceUri}`;
        return super.list(endpoint, info);
    }

    generateExcel(args) {
        var endpoint = `${serviceUri}/download?unitcode=${args.unitcode}&categoryname=${args.categoryname}&unitname=${args.unitname}&category=${args.category}&dateFrom=${args.dateFrom}&dateTo=${args.dateTo}`;
        return super.getXls(endpoint);
    }
}

export class CoreService extends RestService {
    constructor(http, aggregator, config, endpoint) {
        super(http, aggregator, config, "core");
    }

    getUnit(info) {
        var endpoint = `${UnitServiceUri}`;
        return super.list(endpoint, info);
    }
}
