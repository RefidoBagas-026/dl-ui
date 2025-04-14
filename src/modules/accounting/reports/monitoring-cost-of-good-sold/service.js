import { inject, Lazy } from "aurelia-framework";
import { HttpClient } from "aurelia-fetch-client";
import { RestService } from "../../../../utils/rest-service";

const serviceUri = "cost-of-good-sold/monitoring";

export class Service extends RestService {
  constructor(http, aggregator, config, endpoint) {
    super(http, aggregator, config, "dl-report");
  }

  search(info) {
    let endpoint = `${serviceUri}`;

    return super.list(endpoint, info);
  }

  generateExcel(args) {
    var endpoint = `${serviceUri}/download?dateTo=${args.dateTo}`;
    return super.getXls(endpoint);
  }
}
