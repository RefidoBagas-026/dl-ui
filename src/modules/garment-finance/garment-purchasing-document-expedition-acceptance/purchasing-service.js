import { inject, Lazy } from "aurelia-framework";
import { HttpClient } from "aurelia-fetch-client";
import { RestService } from "../../../utils/rest-service";

const serviceUri = "garment-intern-notes";

export class Service extends RestService {
  constructor(http, aggregator, config, endpoint) {
    super(http, aggregator, config, "purchasing-azure");
  }

  getPurchasing() {
        var endpoint = `${serviceUri}/DPPVATIsPaid`;
        return super.get(endpoint);
    }

}
