import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { Base64Helper } from '../../../utils/base-64-coded-helper';
// import moment from 'moment';


@inject(Router, Service)
export class Edit {
  hasCancel = true;
  hasSave = true;

  constructor(router, service) {
    this.router = router;
    this.service = service;
  }

  bind() {
    this.data = this.data || {};
    this.error = {};
  }

  async activate(params) {
    var locale = 'id-ID';
    var moment = require('moment');
    moment.locale(locale);
    var id = params.id;
    let decoded = Base64Helper.decode(id);
    id = decoded;
    this.data = await this.service.getById(id);
    if(this.data.VatTax){
      this.data.useVat = true;
    }
    // this.data.deliverySchedule = moment(this.data.deliverySchedule).format('YYYY-MM-DD');

    // this.data.accountBank.toString = function () {
    //   return [this.accountName, this.bankName, this.accountNumber]
    //     .filter((item, index) => {
    //       return item && item.toString().trim().length > 0;
    //     }).join(" - ");
    // }

    // this.data.agent.toString = function () {
    //   return [this.code, this.name]
    //     .filter((item, index) => {
    //       return item && item.toString().trim().length > 0;
    //     }).join("-");
    // }
  }

  cancel(event) {
    const encoded = Base64Helper.encode(this.data.Id);
    this.router.navigateToRoute('view', { id: encoded });
  }

  save(event) {
    // this.data.deliverySchedule = moment(this.data.deliverySchedule).format("YYYY-MM-DD");
    this.service.update(this.data)
      .then(result => {
        this.cancel();
      })
      .catch(e => {
        this.error = e;
      })
  }
}

