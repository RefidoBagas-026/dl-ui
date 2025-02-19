import { inject, Lazy } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { RestService } from '../../../utils/rest-service';

const serviceUri = 'garment/waste';

export class Service extends RestService {
    constructor(http, aggregator, config, endpoint) {
        // super(http, aggregator, config, "customs-report");
        super(http, aggregator, config, "inventory-azure");
    }

    search(info) {
        let endpoint = `${serviceUri}/report`;
        return super.list(endpoint, info);
    }

    //ENPOINT EXCEL
    xls(info) {
        const endpoint = this._getEndPoint(info);
        console.log(endpoint, info);
        return super.getXls(endpoint);
    }
    _getEndPoint(info) {
        let endpoint = `${serviceUri}/report/download-stockaval`;
        let queryParams = [];
    
        if (info.dateFrom) queryParams.push(`dateFrom=${encodeURIComponent(info.dateFrom)}`);
        if (info.dateTo) queryParams.push(`dateTo=${encodeURIComponent(info.dateTo)}`);
        if (info.type) queryParams.push(`type=${encodeURIComponent(info.TipeItem)}`);
    
        if (queryParams.length > 0) {
            endpoint += `?${queryParams.join("&")}`;
        }
    
        return endpoint;
    }

}