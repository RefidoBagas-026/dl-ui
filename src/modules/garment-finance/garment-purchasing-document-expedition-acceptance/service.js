import { inject, Lazy } from "aurelia-framework";
import { HttpClient } from "aurelia-fetch-client";
import { RestService } from "../../../utils/rest-service";

const uri = "garment-purchasing-expeditions";

export class Service extends RestService {
  constructor(http, aggregator, config, endpoint) {
    super(http, aggregator, config, "finance");
  }

  search(info) {
    return super.list(uri, info);
  }

  getById(id) {
    var endpoint = `${uri}/intern-note-revision/${id}`;
    return super.get(endpoint);
  }

  verificationAccepted(ids) {
    let endpoint = `${uri}/verification-accepted`;
    return super.put(endpoint, ids);
  }

  cashierAccepted(ids) {
    let endpoint = `${uri}/cashier-accepted`;
    return super.put(endpoint, ids);
  }

  accountingAccepted(ids) {
    let endpoint = `${uri}/accounting-accepted`;
    return super.put(endpoint, ids);
  }

  returAccepted(ids) {
    let endpoint = `${uri}/purchasing-accepted`;
    return super.put(endpoint, ids);
  }

  voidVerification(id) {
    let endpoint = `${uri}/void-verification-accepted/${id}`;
    return super.put(endpoint, {});
  }

  sendToPurchasingRejected(id, remark) {
    let endpoint = `${uri}/send-to-purchasing-rejected/${id}`;
    let body = { Remark: remark };
    return super.put(endpoint, body);
  }

  voidAccounting(id) {
    let endpoint = `${uri}/void-accounting-accepted/${id}`;
    return super.put(endpoint, {});
  }

  voidRetur(id) {
    let endpoint = `${uri}/void-retur-accepted/${id}`;
    return super.put(endpoint, {});
  }

  accountingDispositionNotOk(ids,remark) {
    var body = {"ids":ids,"Remark":remark};
    let endpoint = `${uri}/accounting-disposition-not-ok`;
    return super.put(endpoint, body);
    
  }
}
