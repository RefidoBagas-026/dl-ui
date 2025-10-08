import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { Base64Helper } from '../../../utils/base-64-coded-helper';

@inject(Router, Service)
export class View {
  hasCancel = true;
  hasEdit = true;
  hasDelete = true;

  constructor(router, service) {
    this.router = router;
    this.service = service;
  }

  async activate(params) {
    const decoded = Base64Helper.decode(params.id);
    var id = decoded;
    this.data = await this.service.getById(id);

    this.data.Unit.toString = function () {
      return [this.Division.Name, this.Name]
        .filter((item, index) => {
          return item && item.toString().trim().length > 0;
        }).join(" - ");
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
        this.cancelCallback(event);
      });
  }
}
