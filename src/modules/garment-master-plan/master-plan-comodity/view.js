import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service, ServiceSales } from './service';
import { Base64Helper } from '../../../utils/base-64-coded-helper';
import { select } from 'underscore';
import { is } from 'bluebird';

@inject(Router, Service, ServiceSales)
export class View {
  hasCancel = true;
  hasEdit = true;
  hasDelete = true;
  isUseBO = {};

  constructor(router, service, serviceSales) {
    this.router = router;
    this.service = service;
    this.serviceSales =  serviceSales
  }

  async activate(params) {
    const decoded = Base64Helper.decode(params.id);
    var id = decoded;
    this.data = await this.service.getById(id);

    const arg = {
    page: 1,
    size: 25,
    filter: JSON.stringify({
      "Items.First().ComodityCode": this.data.Code
    })
  };
    const result = await this.serviceSales.searchComodityBookingOrder(arg);

    this.isUseBO = result.data.flatMap(bo =>
      (bo.Items || []).filter(i => i.ComodityCode === this.data.Code)
    );

    // Cek jika ada data di isUseBO
    if (this.isUseBO && this.isUseBO.length > 0) {
      this.hasDelete = false;
      this.hasEdit = false;
    } else {
      this.hasDelete = true;
      this.hasEdit = true;
    }
  }

  cancel(event) {
    this.router.navigateToRoute('list');
  }

  edit(event) {
    const encoded = Base64Helper.encode(this.data.Id);
    this.router.navigateToRoute('edit', { id: encoded });
  }

  delete(event) {
    this.service.delete(this.data)
      .then(result => {
        this.cancel();
      });
  }
}