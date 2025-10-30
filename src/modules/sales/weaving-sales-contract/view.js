import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { Base64Helper } from '../../../utils/base-64-coded-helper';


@inject(Router, Service)
export class View {
  constructor(router, service) {
    this.router = router;
    this.service = service;
  }

  async activate(params) {
    // var locale = 'id-ID';
    // var moment = require('moment');
    // moment.locale(locale);
    var id = params.id;
    let decoded = Base64Helper.decode(id);
    id = decoded;
    this.data = await this.service.getById(id);

    if(this.data.VatTax){
      this.data.useVat = true;
    }

  }

  cancelCallback(event) {
    this.router.navigateToRoute('list');
  }

  editCallback(event) {
    const encoded = Base64Helper.encode(this.data.Id);
    this.router.navigateToRoute('edit', { id: encoded });
  }

  deleteCallback(event) {
    this.service.delete(this.data)
      .then(result => {
        this.cancelCallback();
      });
  }
}
