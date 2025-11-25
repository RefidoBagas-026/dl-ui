import { RestService } from '../../../../utils/rest-service'; 

const serviceUri = 'ro-garments';

export class Service extends RestService {

  constructor(http, aggregator, config, endpoint) {
    super(http, aggregator, config, "sales");
  }

search(info) { 
        var endpoint = `${serviceUri}/monitoring-status`;
        return super.list(endpoint,info);
    }
    
generateExcel(info) {
        var endpoint = `${serviceUri}/monitoring-status/download?dateFrom=${info.dateFrom}&dateTo=${info.dateTo}`;
        return super.getXls(endpoint);
    }
}